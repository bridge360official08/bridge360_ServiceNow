import base64
import io
import os
import sys
import unittest

# Ensure current directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from PIL import Image, ImageDraw

from app import app


class TestEasyOCRService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def _create_synthetic_test_image(self, text: str = "GENERIC SAMPLE OCR TEXT 123") -> str:
        """Create a generic synthetic image with high-contrast text and return base64."""
        img = Image.new("RGB", (600, 150), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        # Draw clean high-contrast text
        draw.text((30, 50), text, fill=(0, 0, 0))

        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode("utf-8")

    def test_01_health_endpoint(self):
        """Test GET /health returns valid status, dynamic EasyOCR version, and language info."""
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        print("\n[TEST 1] /health response:", data)

        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["service"], "easyocr-ocr-service")
        self.assertTrue(bool(data.get("easyocr_version")))
        self.assertIn("gpu_available", data)
        self.assertGreater(data.get("supported_languages_count", 0), 50)

    def test_02_generic_ocr_json_endpoint(self):
        """Test POST /ocr with base64 synthetic generic text image."""
        target_text = "INTERNATIONAL VERIFICATION 2026"
        b64_img = self._create_synthetic_test_image(target_text)

        payload = {
            "image": b64_img,
            "languages": ["en"]
        }

        res = self.client.post("/ocr", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        print("\n[TEST 2] /ocr standard generic text response:")
        print(f"  Success: {data.get('success')}")
        print(f"  Extracted text:\n{data.get('text')}")
        print(f"  Line count: {len(data.get('lines', []))}")
        print(f"  Word count: {len(data.get('words', []))}")
        print(f"  Processing time: {data.get('processing_time_ms')} ms")

        self.assertTrue(data["success"])
        self.assertIn("text", data)
        self.assertGreater(len(data["lines"]), 0)
        self.assertGreater(data["processing_time_ms"], 0)

        # Verify line structure
        first_line = data["lines"][0]
        self.assertIn("text", first_line)
        self.assertIn("confidence", first_line)
        self.assertIn("bounding_box", first_line)
        self.assertGreaterEqual(first_line["confidence"], 0.0)
        self.assertLessEqual(first_line["confidence"], 1.0)
        self.assertEqual(len(first_line["bounding_box"]), 4)  # Quad coordinates

        # Strict schema verification: response MUST only contain generic OCR observations
        expected_keys = {"success", "text", "raw_text", "lines", "words", "processing_time_ms"}
        self.assertEqual(set(data.keys()), expected_keys, f"Response contains unexpected keys: {set(data.keys()) - expected_keys}")

    def test_03_invalid_base64_handling(self):
        """Test POST /ocr with corrupted/invalid base64 payload."""
        res = self.client.post("/ocr", json={
            "image": "not_a_valid_base64_string!!!",
            "languages": ["en"]
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("Invalid base64", res.json().get("detail", ""))

    def test_04_corrupted_image_handling(self):
        """Test POST /ocr with valid base64 of non-image binary data."""
        junk_bytes = b"This is just raw text data, not a PNG or JPEG."
        junk_b64 = base64.b64encode(junk_bytes).decode("utf-8")

        res = self.client.post("/ocr", json={
            "image": junk_b64,
            "languages": ["en"]
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("Corrupted, unreadable, or invalid", res.json().get("detail", ""))

    def test_05_unsupported_language_handling(self):
        """Test POST /ocr with nonexistent language code."""
        b64_img = self._create_synthetic_test_image("TEST")
        res = self.client.post("/ocr", json={
            "image": b64_img,
            "languages": ["xyz_invalid_lang"]
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("Unsupported language code", res.json().get("detail", ""))

    def test_06_multilingual_latin_ocr(self):
        """Test POST /ocr with multilingual language list (e.g. en + fr)."""
        french_text = "REPUBLIQUE DOCUMENT OFFICIEL"
        b64_img = self._create_synthetic_test_image(french_text)

        payload = {
            "image": b64_img,
            "languages": ["en", "fr"]
        }

        res = self.client.post("/ocr", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        print("\n[TEST 6] Multilingual ['en', 'fr'] OCR response:")
        print(f"  Success: {data.get('success')}")
        print(f"  Extracted text: {data.get('text')}")
        print(f"  Processing time: {data.get('processing_time_ms')} ms")

        self.assertTrue(data["success"])
        self.assertGreater(len(data["lines"]), 0)

    def test_07_multipart_file_upload(self):
        """Test POST /ocr with multipart/form-data image file upload."""
        img = Image.new("RGB", (400, 100), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        draw.text((20, 40), "MULTIPART UPLOAD TEST", fill=(0, 0, 0))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)

        files = {"file": ("test.png", buf.getvalue(), "image/png")}
        data = {"languages": "en"}

        res = self.client.post("/ocr", files=files, data=data)
        self.assertEqual(res.status_code, 200)
        resp_data = res.json()
        print("\n[TEST 7] Multipart upload response:")
        print(f"  Success: {resp_data.get('success')}")
        print(f"  Extracted text: {resp_data.get('text')}")
        self.assertTrue(resp_data["success"])
        self.assertGreater(len(resp_data["lines"]), 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
