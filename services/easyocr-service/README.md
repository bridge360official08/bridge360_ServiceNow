# Bridge360 Standalone EasyOCR Microservice

An isolated, document-agnostic HTTP OCR microservice wrapping the official [EasyOCR](https://github.com/JaidedAI/EasyOCR) engine. Designed as a generic fallback OCR engine for the Bridge360 Refugee Family Case Management platform.

> [!IMPORTANT]
> **Strict Separation of Concerns**:
> EasyOCR is a **pure OCR engine** providing raw textual observations (text, coordinates, confidence). It is completely decoupled from Bridge360 document schemas and country configurations. ServiceNow remains the single source of truth for Country → Country Document → Configured Document Fields.

---

## Features

- **Official Engine**: Wraps official `easyocr>=1.7.2` (commit `363afb184047ce452e436f4224f3098422df872e`).
- **Standardized API**:
  - `GET /health`: Dynamic engine version check, GPU status, and supported language catalog.
  - `POST /ocr`: Accepts base64 JSON payload or multipart file upload.
- **Multilingual Support**: Supports 80+ languages using EasyOCR's native language code system.
- **Generic Bidirectional Normalization**: Unicode-driven script direction detection that restores logical text order and orders bounding boxes right-to-left for RTL scripts (Arabic, Persian, Urdu, Hebrew), while preserving untouched raw EasyOCR output.
- **Generic Image Preprocessing**: Configurable image enhancement pipeline (contrast normalization via CLAHE, adaptive upscaling, and sharpening) improving recognition of complex scripts (CJK, Indic).
- **Performance Optimized**: Model readers are cached in-memory by language combination to eliminate per-request initialization latency.
- **Rich Observations**: Returns full text, raw text, line-level bounding boxes (`[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]`), word-level breakdowns, and confidence ratings.
- **Container Ready**: Includes Dockerfile and docker-compose specification.

---

## Architecture Overview

```
                      Client Request
        (Base64 JSON or Multipart Form Upload)
                            │
                            ▼
                ┌───────────────────────┐
                │     FastAPI App       │
                │  services/easyocr-    │
                │       service         │
                └───────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │ Validate Langs & Image    │
              │ Fetch Cached Reader (Lang)│
              │ Optional Preprocessing    │
              │ (CLAHE, Upscaling, Sharpen│
              └─────────────┬─────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │   EasyOCR Pipeline    │
                │  - CRAFT Detector     │
                │  - CRNN Recognizer    │
                └───────────┬───────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Generic Post-Processing   │
              │ - Unicode Bidi Normalizer │
              │ - RTL Reading-Order Sort  │
              │ - Raw Text Preservation   │
              └───────────┬───────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │ Standard OCR Observations │
              │ - text, raw_text, lines   │
              │ - bounding_box coordinates│
              │ - confidence & timing     │
              └───────────────────────────┘
```

---

## Configuration (Environment Variables)

All deployment options are controlled through environment variables:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `HOST` | `0.0.0.0` | Bind host address |
| `PORT` | `8088` | HTTP service listening port |
| `EASYOCR_MODEL_DIR` | `~/.EasyOCR/model` | Local directory for storing downloaded CRAFT and recognizer weights |
| `EASYOCR_GPU` | `false` | Enable CUDA GPU acceleration (`true`/`false`) |
| `MAX_REQUEST_SIZE_MB` | `25` | Maximum allowed image payload size in megabytes |
| `OCR_TIMEOUT_SECONDS` | `60` | Request processing timeout |
| `DEFAULT_PREPROCESS` | `false` | Enable generic image preprocessing (CLAHE, scaling, sharpening) by default |
| `DEFAULT_MAG_RATIO` | `1.0` | Default magnification ratio for text detection/recognition |
| `ENABLE_BIDI_NORMALIZATION` | `true` | Enable generic Unicode bidirectional text reordering & line reconstruction |

---

## Getting Started Locally

### 1. Prerequisites
- Python 3.10, 3.11, 3.12, or 3.14
- PyTorch & Torchvision compatible with your operating system

### 2. Install Dependencies
```bash
cd services/easyocr-service
pip install -r requirements.txt
```

### 3. Run the Service
```bash
python app.py
```
Or with Uvicorn:
```bash
uvicorn app:app --host 0.0.0.0 --port 8088 --reload
```

The service will start on `http://localhost:8088`.

---

## API Specification

### 1. Health Check: `GET /health`

**Request:**
```bash
curl http://localhost:8088/health
```

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "service": "easyocr-ocr-service",
  "easyocr_version": "1.7.2",
  "gpu_available": false,
  "gpu_enabled": false,
  "supported_languages_count": 86,
  "supported_languages_sample": [
    "abq", "ady", "af", "ang", "ar", "as", "ava", "az", "be", "bg", "bgc", "bh", "bho", "bn", "bs"
  ]
}
```

---

### 2. Perform OCR: `POST /ocr`

#### Option A: Base64 JSON Payload
```bash
curl -X POST http://localhost:8088/ocr \
  -H "Content-Type: application/json" \
  -d '{
    "image": "<base64_string>",
    "languages": ["en"]
  }'
```

#### Option B: Multipart File Upload
```bash
curl -X POST http://localhost:8088/ocr \
  -F "file=@/path/to/document.png" \
  -F "languages=en,fr"
```

#### Response Contract (`200 OK`):
```json
{
  "success": true,
  "text": "INTERNATIONAL VERIFICATION 2026",
  "raw_text": "INTERNATIONAL VERIFICATION 2026",
  "lines": [
    {
      "text": "INTERNATIONAL VERIFICATION 2026",
      "raw_text": "INTERNATIONAL VERIFICATION 2026",
      "confidence": 0.9412,
      "bounding_box": [
        [30.0, 50.0],
        [480.0, 50.0],
        [480.0, 85.0],
        [30.0, 85.0]
      ]
    }
  ],
  "words": [
    {
      "text": "INTERNATIONAL",
      "confidence": 0.9412,
      "bounding_box": [[30.0, 50.0], [480.0, 50.0], [480.0, 85.0], [30.0, 85.0]]
    },
    {
      "text": "VERIFICATION",
      "confidence": 0.9412,
      "bounding_box": [[30.0, 50.0], [480.0, 50.0], [480.0, 85.0], [30.0, 85.0]]
    },
    {
      "text": "2026",
      "confidence": 0.9412,
      "bounding_box": [[30.0, 50.0], [480.0, 50.0], [480.0, 85.0], [30.0, 85.0]]
    }
  ],
  "processing_time_ms": 782
}
```

---

## Running Automated Tests

Run the standalone unit test suite:
```bash
cd services/easyocr-service
python test_service.py
```

The test verifies:
1. `GET /health` validity and dynamic EasyOCR version detection.
2. Synthetic generic image OCR with bounding box and confidence parsing.
3. Invalid base64 error handling (`400 Bad Request`).
4. Corrupted non-image binary error handling (`400 Bad Request`).
5. Unsupported language code error handling (`400 Bad Request`).
6. Multilingual OCR execution (`['en', 'fr']`).
7. Multipart form file upload (`POST /ocr`).

---

## Docker Deployment

### Build and Run with Docker Compose
```bash
cd services/easyocr-service
docker-compose up --build -d
```

### Build Image Directly
```bash
docker build -t bridge360-easyocr:latest .
docker run -p 8088:8088 -v easyocr-models:/root/.EasyOCR/model bridge360-easyocr:latest
```

---

## Bridge360 Architectural Integration (Future Fallback)

In future development, when ServiceNow Document Intelligence produces incomplete, empty, or poor OCR candidates on difficult scans, Bridge360 will route the image to this EasyOCR service as a secondary fallback:

```
ServiceNow Document Intelligence
        ↓
quality/completeness check
        ↓
GOOD ───────────────→ existing extraction pipeline
        ↓
POOR / insufficient
        ↓
EasyOCR Service (/ocr)
        ↓
common raw OCR representation
        ↓
existing dynamic extraction (u_bridge360_country_document_field)
        ↓
Layer 1
```

EasyOCR provides raw OCR text and bounding boxes; Bridge360's dynamic configuration-driven extraction layer performs the attribute matching into ServiceNow fields.
