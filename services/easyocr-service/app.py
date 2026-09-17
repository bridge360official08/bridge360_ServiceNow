import base64
import io
import logging
import threading
import time
from typing import List, Optional, Union

import easyocr
import easyocr.config as easyocr_config
import numpy as np
import torch
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, ImageOps
from pydantic import BaseModel, Field

from config import settings
from postprocessing import reconstruct_lines_and_reorder
from preprocessing import generic_preprocess_image

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("easyocr-service")

app = FastAPI(
    title="Bridge360 Standalone EasyOCR Microservice",
    description="Generic, document-agnostic OCR HTTP service wrapping official EasyOCR",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global Reader Cache with Thread Lock
_reader_lock = threading.Lock()
_readers = {}
SUPPORTED_LANGUAGES = set(easyocr_config.all_lang_list)


def get_reader(languages: List[str]) -> easyocr.Reader:
    """Retrieve or initialize a cached EasyOCR Reader instance."""
    clean_langs = tuple(sorted(set(languages)))
    cache_key = (clean_langs, settings.EASYOCR_GPU, settings.EASYOCR_MODEL_DIR)

    with _reader_lock:
        if cache_key not in _readers:
            logger.info("Initializing EasyOCR Reader for languages: %s (GPU: %s)", clean_langs, settings.EASYOCR_GPU)
            _readers[cache_key] = easyocr.Reader(
                lang_list=list(clean_langs),
                gpu=settings.EASYOCR_GPU,
                model_storage_directory=settings.EASYOCR_MODEL_DIR,
                download_enabled=True,
                verbose=False
            )
        return _readers[cache_key]


# --- API Models ---

class LineItem(BaseModel):
    text: str
    raw_text: Optional[str] = None
    confidence: float
    bounding_box: List[List[Union[int, float]]]


class WordItem(BaseModel):
    text: str
    confidence: float
    bounding_box: List[List[Union[int, float]]]


class OCRResponse(BaseModel):
    success: bool
    text: str
    raw_text: Optional[str] = None
    lines: List[LineItem]
    words: List[WordItem]
    processing_time_ms: int


class OCRJsonRequest(BaseModel):
    image: str = Field(..., description="Base64 encoded image string or data URI")
    languages: Optional[List[str]] = Field(default=["en"], description="List of generic language codes (e.g. ['en'])")
    preprocess: Optional[bool] = Field(default=None, description="Enable generic image preprocessing (CLAHE, scaling, sharpening)")
    mag_ratio: Optional[float] = Field(default=None, description="Image magnification ratio for text detection/recognition")


# --- Endpoints ---

@app.get("/health")
def health_check():
    """Health check endpoint exposing runtime metadata."""
    cuda_available = torch.cuda.is_available()
    return {
        "status": "ok",
        "service": "easyocr-ocr-service",
        "easyocr_version": easyocr.__version__,
        "gpu_available": cuda_available,
        "gpu_enabled": settings.EASYOCR_GPU,
        "default_preprocess": settings.DEFAULT_PREPROCESS,
        "default_mag_ratio": settings.DEFAULT_MAG_RATIO,
        "bidi_normalization_enabled": settings.ENABLE_BIDI_NORMALIZATION,
        "supported_languages_count": len(SUPPORTED_LANGUAGES),
        "supported_languages_sample": sorted(list(SUPPORTED_LANGUAGES))[:15]
    }


def _validate_and_clean_languages(languages: Optional[List[str]]) -> List[str]:
    """Validate requested language codes against EasyOCR's supported language list."""
    if not languages:
        return ["en"]

    clean_langs = []
    invalid_langs = []
    for l in languages:
        code = str(l).strip().lower()
        if not code:
            continue
        if code in SUPPORTED_LANGUAGES:
            clean_langs.append(code)
        else:
            invalid_langs.append(code)

    if invalid_langs:
        logger.warning(f"Unsupported or unrecognized language code(s): {invalid_langs}. Falling back to valid subset or 'en'.")

    return clean_langs or ["en"]


def _decode_image_bytes(image_bytes: bytes) -> np.ndarray:
    """Decode raw image bytes to an RGB numpy array."""
    max_bytes = settings.MAX_REQUEST_SIZE_MB * 1024 * 1024
    if len(image_bytes) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds maximum limit of {settings.MAX_REQUEST_SIZE_MB}MB."
        )

    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image = ImageOps.exif_transpose(pil_image)  # Handle orientation
        pil_image = pil_image.convert("RGB")
        return np.array(pil_image)
    except Exception as e:
        logger.warning("Image decoding failed: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Corrupted, unreadable, or invalid image format."
        )


def _process_ocr(
    image_np: np.ndarray,
    languages: List[str],
    preprocess: Optional[bool] = None,
    mag_ratio: Optional[float] = None
) -> OCRResponse:
    """Run EasyOCR detection & recognition with generic preprocessing and bidi normalization."""
    reader = get_reader(languages)

    do_preprocess = settings.DEFAULT_PREPROCESS if preprocess is None else bool(preprocess)
    use_mag_ratio = settings.DEFAULT_MAG_RATIO if mag_ratio is None else float(mag_ratio)

    start_time = time.perf_counter()

    # Optional generic image preprocessing
    working_img = image_np
    if do_preprocess:
        try:
            working_img = generic_preprocess_image(image_np)
        except Exception as e:
            logger.warning("Generic preprocessing failed, proceeding with original image: %s", str(e))
            working_img = image_np

    try:
        raw_results = reader.readtext(working_img, mag_ratio=use_mag_ratio)
    except Exception as e:
        logger.error("OCR execution error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal OCR processing failure."
        )
    elapsed_ms = int((time.perf_counter() - start_time) * 1000)

    # Structured lines and words assembly via generic postprocessing
    if settings.ENABLE_BIDI_NORMALIZATION:
        structured_lines = reconstruct_lines_and_reorder(raw_results)
        lines: List[LineItem] = []
        words: List[WordItem] = []

        for sl in structured_lines:
            lines.append(LineItem(
                text=sl["text"],
                raw_text=sl["raw_text"],
                confidence=sl["confidence"],
                bounding_box=sl["bounding_box"]
            ))
            for w in sl["words"]:
                words.append(WordItem(
                    text=w["text"],
                    confidence=w["confidence"],
                    bounding_box=w["bounding_box"]
                ))

        full_text = "\n".join(l.text for l in lines)
        full_raw_text = "\n".join(l.raw_text for l in lines if l.raw_text)
    else:
        lines = []
        words = []
        for bbox, text, conf in raw_results:
            clean_text = str(text).strip()
            if not clean_text:
                continue
            clean_bbox = [[float(pt[0]), float(pt[1])] for pt in bbox]
            clean_conf = round(float(conf), 4)
            lines.append(LineItem(
                text=clean_text,
                raw_text=clean_text,
                confidence=clean_conf,
                bounding_box=clean_bbox
            ))
            for tok in clean_text.split():
                words.append(WordItem(
                    text=tok,
                    confidence=clean_conf,
                    bounding_box=clean_bbox
                ))
        full_text = "\n".join(l.text for l in lines)
        full_raw_text = full_text

    return OCRResponse(
        success=True,
        text=full_text,
        raw_text=full_raw_text,
        lines=lines,
        words=words,
        processing_time_ms=elapsed_ms
    )


@app.post("/ocr", response_model=OCRResponse)
async def ocr_endpoint(
    request: Request,
    file: Optional[UploadFile] = File(None),
    languages: Optional[str] = Form(None),
    preprocess: Optional[bool] = Form(None),
    mag_ratio: Optional[float] = Form(None)
):
    """
    Perform generic, document-agnostic OCR on an uploaded image.
    Accepts either:
    1. JSON: {"image": "<base64>", "languages": ["en"], "preprocess": false, "mag_ratio": 1.0}
    2. Multipart: file upload + optional languages comma-separated form field + optional preprocess/mag_ratio
    """
    content_type = request.headers.get("content-type", "").lower()
    img_bytes = None
    target_languages = ["en"]
    req_preprocess = preprocess
    req_mag_ratio = mag_ratio

    if file is not None:
        img_bytes = await file.read()
        if languages:
            target_languages = [l.strip() for l in languages.split(",") if l.strip()]
    elif "application/json" in content_type:
        try:
            body = await request.json()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Malformed JSON body."
            )

        b64_str = body.get("image")
        if not b64_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing 'image' parameter in JSON payload."
            )

        # Strip data URI prefix if present
        if "," in b64_str and b64_str.startswith("data:"):
            b64_str = b64_str.split(",", 1)[1]

        try:
            img_bytes = base64.b64decode(b64_str)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid base64 string provided."
            )

        if "languages" in body and isinstance(body["languages"], list):
            target_languages = body["languages"]
        if "preprocess" in body:
            req_preprocess = body.get("preprocess")
        if "mag_ratio" in body:
            req_mag_ratio = body.get("mag_ratio")
    else:
        # Fallback inspection of raw body or empty request
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request must be either JSON with base64 'image' or multipart/form-data with 'file'."
        )

    if not img_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty or missing image payload."
        )

    validated_langs = _validate_and_clean_languages(target_languages)
    image_np = _decode_image_bytes(img_bytes)

    return _process_ocr(image_np, validated_langs, preprocess=req_preprocess, mag_ratio=req_mag_ratio)


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting EasyOCR HTTP service on %s:%d", settings.HOST, settings.PORT)
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
