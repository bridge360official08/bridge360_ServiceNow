import os

class Settings:
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8088"))
    EASYOCR_MODEL_DIR: str = os.getenv(
        "EASYOCR_MODEL_DIR",
        os.path.expanduser("~/.EasyOCR/model")
    )
    EASYOCR_GPU: bool = os.getenv("EASYOCR_GPU", "false").lower() in ("true", "1", "yes")
    MAX_REQUEST_SIZE_MB: int = int(os.getenv("MAX_REQUEST_SIZE_MB", "25"))
    OCR_TIMEOUT_SECONDS: int = int(os.getenv("OCR_TIMEOUT_SECONDS", "60"))
    DEFAULT_PREPROCESS: bool = os.getenv("DEFAULT_PREPROCESS", "false").lower() in ("true", "1", "yes")
    DEFAULT_MAG_RATIO: float = float(os.getenv("DEFAULT_MAG_RATIO", "1.0"))
    ENABLE_BIDI_NORMALIZATION: bool = os.getenv("ENABLE_BIDI_NORMALIZATION", "true").lower() in ("true", "1", "yes")

settings = Settings()
