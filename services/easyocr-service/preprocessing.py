"""
Generic Image Preprocessing Pipeline for Standalone EasyOCR Service.

Document-agnostic, language-agnostic image enhancement operations:
- Adaptive rescaling (for small or low-resolution text)
- Contrast normalization (CLAHE)
- Detail sharpening
- Noise reduction

All operations apply uniformly without language or document-type branching.
"""

import cv2
import numpy as np
import logging

logger = logging.getLogger("easyocr-service.preprocessing")


def generic_preprocess_image(
    image_np: np.ndarray,
    scale_factor: float = 1.0,
    enhance_contrast: bool = True,
    sharpen: bool = True,
    denoise: bool = False
) -> np.ndarray:
    """
    Apply generic, document-agnostic enhancement to an RGB image array.

    Args:
        image_np: Input image as an RGB numpy array.
        scale_factor: Optional multiplier to upscale small input images.
        enhance_contrast: If True, applies CLAHE contrast equalization.
        sharpen: If True, applies subtle unsharp masking for edge definition.
        denoise: If True, applies fast bilateral filtering for noise reduction.

    Returns:
        Enhanced RGB numpy array.
    """
    if image_np is None or image_np.size == 0:
        return image_np

    # Ensure RGB uint8
    img = np.ascontiguousarray(image_np, dtype=np.uint8)

    # 1. Grayscale conversion for luminance processing
    if len(img.shape) == 2:
        gray = img
    elif img.shape[2] == 4:
        gray = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
    else:
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    h, w = gray.shape[:2]

    # 2. Rescale / Upscale if requested or if dimensions are small
    if scale_factor > 1.0:
        new_w = int(round(w * scale_factor))
        new_h = int(round(h * scale_factor))
        gray = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
    elif h < 300 or w < 300:
        # Auto-upscale very small images to give OCR sufficient pixel density
        auto_scale = max(1.5, min(3.0, 600.0 / max(h, w)))
        new_w = int(round(w * auto_scale))
        new_h = int(round(h * auto_scale))
        gray = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)

    # 3. Optional Denoising
    if denoise:
        gray = cv2.bilateralFilter(gray, d=5, sigmaColor=50, sigmaSpace=50)

    # 4. Contrast Normalization (CLAHE)
    if enhance_contrast:
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        gray = clahe.apply(gray)

    # 5. Detail Sharpening (Unsharp masking)
    if sharpen:
        gaussian = cv2.GaussianBlur(gray, (0, 0), sigmaX=1.0)
        sharpened = cv2.addWeighted(gray, 1.5, gaussian, -0.5, 0)
        gray = np.clip(sharpened, 0, 255).astype(np.uint8)

    # Return as 3-channel RGB image for EasyOCR
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)
