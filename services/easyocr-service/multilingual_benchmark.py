#!/usr/bin/env python3
"""
Global Multilingual EasyOCR Benchmark
=======================================
Tests the standalone EasyOCR HTTP service across ~42 languages and 12+ writing
systems. Validates font rendering, model initialization, and OCR accuracy
independently to produce an honest assessment of real global capability.

Target service: http://127.0.0.1:8088
"""

import base64
import io
import json
import os
import sys
import time
from difflib import SequenceMatcher

# Force UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import numpy as np
import requests
from PIL import Image, ImageDraw, ImageFont

SERVICE_URL = "http://127.0.0.1:8088"
OCR_ENDPOINT = f"{SERVICE_URL}/ocr"
HEALTH_ENDPOINT = f"{SERVICE_URL}/health"
WIN_FONTS_DIR = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts")

# Minimum dark-pixel count to consider a font rendering valid
MIN_RENDER_PIXELS = 300

# ──────────────────────────────────────────────────────────────────────────────
# GLOBAL TEST CASES
# ──────────────────────────────────────────────────────────────────────────────

TEST_CASES = [
    # ── LATIN SCRIPT ──
    {"language": "English", "code": "en", "script": "Latin",
     "texts": ["The quick brown fox jumps over the lazy dog", "Good morning, welcome to the city", "Today is a beautiful day"]},
    {"language": "French", "code": "fr", "script": "Latin",
     "texts": ["Bonjour et bienvenue dans notre ville", "Le soleil brille dans le ciel bleu"]},
    {"language": "Spanish", "code": "es", "script": "Latin",
     "texts": ["Buenos dias y bienvenidos", "La vida es bella y maravillosa"]},
    {"language": "German", "code": "de", "script": "Latin",
     "texts": ["Guten Morgen und willkommen", "Das Wetter ist heute sehr schon"]},
    {"language": "Portuguese", "code": "pt", "script": "Latin",
     "texts": ["Bom dia e bem vindos", "O mundo e grande e bonito"]},
    {"language": "Italian", "code": "it", "script": "Latin",
     "texts": ["Buongiorno e benvenuti nella citta", "La musica e il linguaggio universale"]},
    {"language": "Vietnamese", "code": "vi", "script": "Latin",
     "texts": ["Xin chao va chao mung", "Hom nay la mot ngay dep troi"]},
    {"language": "Dutch", "code": "nl", "script": "Latin",
     "texts": ["Goedemorgen en welkom hier", "Het weer is vandaag heel mooi"]},
    {"language": "Polish", "code": "pl", "script": "Latin",
     "texts": ["Dzien dobry i witamy serdecznie", "Dzisiaj jest piekny dzien"]},
    {"language": "Czech", "code": "cs", "script": "Latin",
     "texts": ["Dobry den a vitejte", "Dnes je krasny den"]},
    {"language": "Swedish", "code": "sv", "script": "Latin",
     "texts": ["God morgon och valkommen", "Idag ar en vacker dag"]},
    {"language": "Turkish", "code": "tr", "script": "Latin",
     "texts": ["Gunaydin ve hosgeldiniz", "Bugun hava cok guzel"]},
    {"language": "Indonesian", "code": "id", "script": "Latin",
     "texts": ["Selamat pagi dan selamat datang", "Hari ini cuaca sangat cerah"]},
    {"language": "Malay", "code": "ms", "script": "Latin",
     "texts": ["Selamat pagi dan selamat datang", "Cuaca hari ini sangat baik"]},
    {"language": "Croatian", "code": "hr", "script": "Latin",
     "texts": ["Dobro jutro i dobrodosli", "Danas je lijep dan"]},
    {"language": "Hungarian", "code": "hu", "script": "Latin",
     "texts": ["Jo reggelt es udv", "Ma szep nap van"]},
    {"language": "Romanian", "code": "ro", "script": "Latin",
     "texts": ["Buna dimineata si bun venit", "Astazi este o zi frumoasa"]},
    {"language": "Slovak", "code": "sk", "script": "Latin",
     "texts": ["Dobre rano a vitajte", "Dnes je krasny den"]},
    {"language": "Slovenian", "code": "sl", "script": "Latin",
     "texts": ["Dobro jutro in dobrodosli", "Danes je lep dan"]},
    # ── CYRILLIC SCRIPT ──
    {"language": "Russian", "code": "ru", "script": "Cyrillic",
     "texts": ["\u0414\u043e\u0431\u0440\u043e\u0435 \u0443\u0442\u0440\u043e", "\u0421\u0435\u0433\u043e\u0434\u043d\u044f \u0445\u043e\u0440\u043e\u0448\u0438\u0439 \u0434\u0435\u043d\u044c"]},
    {"language": "Ukrainian", "code": "uk", "script": "Cyrillic",
     "texts": ["\u0414\u043e\u0431\u0440\u0438\u0439 \u0440\u0430\u043d\u043e\u043a", "\u0421\u044c\u043e\u0433\u043e\u0434\u043d\u0456 \u0433\u0430\u0440\u043d\u0438\u0439 \u0434\u0435\u043d\u044c"]},
    {"language": "Bulgarian", "code": "bg", "script": "Cyrillic",
     "texts": ["\u0414\u043e\u0431\u0440\u043e \u0443\u0442\u0440\u043e", "\u0414\u043d\u0435\u0441 \u0435 \u0445\u0443\u0431\u0430\u0432 \u0434\u0435\u043d"]},
    # ── ARABIC SCRIPT ──
    {"language": "Arabic", "code": "ar", "script": "Arabic",
     "texts": ["\u0635\u0628\u0627\u062d \u0627\u0644\u062e\u064a\u0631", "\u0627\u0644\u064a\u0648\u0645 \u0637\u0642\u0633 \u062c\u0645\u064a\u0644"]},
    {"language": "Persian", "code": "fa", "script": "Arabic",
     "texts": ["\u0635\u0628\u062d \u0628\u062e\u064a\u0631", "\u0627\u0645\u0631\u0648\u0632 \u0647\u0648\u0627 \u0632\u064a\u0628\u0627\u0633\u062a"]},
    {"language": "Urdu", "code": "ur", "script": "Arabic",
     "texts": ["\u0635\u0628\u062d \u0628\u062e\u064a\u0631", "\u0622\u062c \u0645\u0648\u0633\u0645 \u0627\u0686\u06be\u0627 \u06c1\u06d2"]},
    # ── DEVANAGARI ──
    {"language": "Hindi", "code": "hi", "script": "Devanagari",
     "texts": ["\u0938\u0941\u092a\u094d\u0930\u092d\u093e\u0924\u092e\u094d", "\u0906\u091c \u092e\u094c\u0938\u092e \u0905\u091a\u094d\u091b\u093e \u0939\u0948"]},
    {"language": "Marathi", "code": "mr", "script": "Devanagari",
     "texts": ["\u0938\u0941\u092a\u094d\u0930\u092d\u093e\u0924", "\u0906\u091c \u0939\u0935\u093e\u092e\u093e\u0928 \u091b\u093e\u0928 \u0906\u0939\u0947"]},
    {"language": "Nepali", "code": "ne", "script": "Devanagari",
     "texts": ["\u0936\u0941\u092d\u092a\u094d\u0930\u092d\u093e\u0924", "\u0906\u091c \u092e\u094c\u0938\u092e \u0930\u093e\u092e\u094d\u0930\u094b \u091b"]},
    # ── SOUTH ASIAN ──
    {"language": "Tamil", "code": "ta", "script": "Tamil",
     "texts": ["\u0b92\u0bb0\u0bc1 \u0ba8\u0bb2\u0bcd\u0bb2 \u0ba8\u0bbe\u0bb3\u0bcd", "\u0bb5\u0ba3\u0b95\u0bcd\u0b95\u0bae\u0bcd"]},
    {"language": "Bengali", "code": "bn", "script": "Bengali",
     "texts": ["\u09b6\u09c1\u09ad \u09b8\u0995\u09be\u09b2", "\u0986\u099c \u0986\u09ac\u09b9\u09be\u0993\u09af\u09bc\u09be \u09ad\u09be\u09b2\u09cb"]},
    {"language": "Telugu", "code": "te", "script": "Telugu",
     "texts": ["\u0c36\u0c41\u0c2d\u0c4b\u0c26\u0c2f\u0c02", "\u0c08 \u0c30\u0c4b\u0c1c\u0c41 \u0c2e\u0c02\u0c1a\u0c3f \u0c30\u0c4b\u0c1c\u0c41"]},
    {"language": "Kannada", "code": "kn", "script": "Kannada",
     "texts": ["\u0cb6\u0cc1\u0cad\u0cca\u0ca6\u0caf", "\u0c88 \u0ca6\u0cbf\u0ca8 \u0c92\u0cb3\u0ccd\u0cb3\u0cc6\u0caf \u0ca6\u0cbf\u0ca8"]},
    {"language": "Assamese", "code": "as", "script": "Bengali",
     "texts": ["\u09b6\u09c1\u09ad \u09aa\u09cd\u09f0\u09ad\u09be\u09a4", "\u0986\u099c\u09bf \u09ac\u09a8\u09c7\u09f0\u09c1\u09f1\u09be \u09ad\u09be\u09b2"]},
    # ── CJK ──
    {"language": "Chinese Simplified", "code": "ch_sim", "script": "CJK",
     "texts": ["\u65e9\u4e0a\u597d", "\u4eca\u5929\u5929\u6c14\u5f88\u597d"]},
    {"language": "Chinese Traditional", "code": "ch_tra", "script": "CJK",
     "texts": ["\u65e9\u5b89", "\u4eca\u5929\u5929\u6c23\u5f88\u597d"]},
    {"language": "Japanese", "code": "ja", "script": "CJK",
     "texts": ["\u304a\u306f\u3088\u3046\u3054\u3056\u3044\u307e\u3059", "\u4eca\u65e5\u306f\u826f\u3044\u5929\u6c17\u3067\u3059"]},
    {"language": "Korean", "code": "ko", "script": "CJK",
     "texts": ["\uc88b\uc740 \uc544\uce68\uc785\ub2c8\ub2e4", "\uc624\ub298 \ub0a0\uc528\uac00 \uc88b\uc2b5\ub2c8\ub2e4"]},
    # ── THAI ──
    {"language": "Thai", "code": "th", "script": "Thai",
     "texts": ["\u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e35\u0e04\u0e23\u0e31\u0e1a", "\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49\u0e2d\u0e32\u0e01\u0e32\u0e28\u0e14\u0e35"]},
    # ── BILINGUAL / MIXED ──
    {"language": "English+Hindi", "code": "en", "script": "Latin", "extra_langs": ["hi"],
     "texts": ["Welcome to the office"]},
    {"language": "English+Arabic", "code": "en", "script": "Latin", "extra_langs": ["ar"],
     "texts": ["Welcome to our office"]},
    {"language": "English+Chinese", "code": "en", "script": "Latin", "extra_langs": ["ch_sim"],
     "texts": ["Hello World 2025"]},
]

# ── FONT PREFERENCES PER SCRIPT ──
SCRIPT_FONT_PREFERENCES = {
    "Latin": ["arial.ttf", "times.ttf", "calibri.ttf", "verdana.ttf"],
    "Cyrillic": ["arial.ttf", "times.ttf", "tahoma.ttf"],
    "Arabic": ["tahomabd.ttf", "tahoma.ttf", "arial.ttf"],
    "Devanagari": ["Nirmala.ttc", "mangal.ttf", "Nirmala.ttf"],
    "Tamil": ["Nirmala.ttc", "latha.ttf", "Nirmala.ttf"],
    "Bengali": ["Nirmala.ttc", "vrinda.ttf", "Nirmala.ttf"],
    "Telugu": ["Nirmala.ttc", "gautami.ttf", "Nirmala.ttf"],
    "Kannada": ["Nirmala.ttc", "tunga.ttf", "Nirmala.ttf"],
    "CJK": ["msyh.ttc", "msjh.ttc", "simsun.ttc", "malgun.ttf", "yugothb.ttc", "msgothic.ttc", "meiryo.ttc"],
    "Thai": ["tahoma.ttf", "tahomabd.ttf", "leelawad.ttf", "cordia.ttc"],
}

_font_cache = {}


def _validate_font_renders_text(font_path, text, size=48):
    try:
        font = ImageFont.truetype(font_path, size)
        img = Image.new("L", (800, 150), 255)
        draw = ImageDraw.Draw(img)
        draw.text((30, 30), text, fill=0, font=font)
        arr = np.array(img)
        dark_pixels = int(np.sum(arr < 128))
        img2 = Image.new("L", (800, 150), 255)
        draw2 = ImageDraw.Draw(img2)
        draw2.text((30, 30), "\ufffd" * len(text), fill=0, font=font)
        arr2 = np.array(img2)
        if np.array_equal(arr, arr2) and dark_pixels < 1000:
            return 0
        return dark_pixels
    except Exception:
        return 0


def find_best_font(script, sample_text, size=48):
    cache_key = (script, sample_text[:10])
    if cache_key in _font_cache:
        return _font_cache[cache_key]
    candidates = SCRIPT_FONT_PREFERENCES.get(script, ["arial.ttf", "tahoma.ttf", "malgun.ttf"])
    for fn in candidates:
        fpath = os.path.join(WIN_FONTS_DIR, fn)
        if not os.path.exists(fpath):
            continue
        dark = _validate_font_renders_text(fpath, sample_text, size)
        if dark >= MIN_RENDER_PIXELS:
            _font_cache[cache_key] = (fpath, fn, dark)
            return (fpath, fn, dark)
    try:
        all_fonts = [f for f in os.listdir(WIN_FONTS_DIR) if f.lower().endswith((".ttf", ".ttc"))]
    except OSError:
        all_fonts = []
    best = (None, None, 0)
    for fn in all_fonts:
        fpath = os.path.join(WIN_FONTS_DIR, fn)
        dark = _validate_font_renders_text(fpath, sample_text, size)
        if dark > best[2]:
            best = (fpath, fn, dark)
            if dark >= MIN_RENDER_PIXELS * 3:
                break
    if best[2] >= MIN_RENDER_PIXELS:
        _font_cache[cache_key] = best
        return best
    _font_cache[cache_key] = (None, None, 0)
    return (None, None, 0)


def generate_test_image(text, font_path, font_size=48):
    font = ImageFont.truetype(font_path, font_size)
    tmp_img = Image.new("RGB", (1, 1), "white")
    tmp_draw = ImageDraw.Draw(tmp_img)
    bbox = tmp_draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad = 60
    iw = max(tw + pad * 2, 400)
    ih = max(th + pad * 2, 120)
    img = Image.new("RGB", (iw, ih), "white")
    draw = ImageDraw.Draw(img)
    x = (iw - tw) // 2
    y = (ih - th) // 2
    draw.text((x, y), text, fill="black", font=font)
    return img


def image_to_base64(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def similarity(a, b):
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.strip(), b.strip()).ratio()


def classify_result(sim, status, model_ok, font_ok):
    if status == "MODEL_ERROR":
        return "MODEL_ERROR"
    if status == "FONT_UNAVAILABLE":
        return "FONT_UNAVAILABLE"
    if status.startswith("HTTP_") or status == "SERVICE_ERROR":
        return "SERVICE_ERROR"
    if status == "UNAVAILABLE":
        return "UNAVAILABLE"
    if not model_ok:
        return "MODEL_ERROR"
    if not font_ok:
        return "FONT_UNAVAILABLE"
    if sim >= 0.90:
        return "PASS"
    elif sim >= 0.50:
        return "PARTIAL"
    else:
        return "FAIL"


def check_health():
    try:
        resp = requests.get(HEALTH_ENDPOINT, timeout=10)
        return True, resp.json()
    except Exception as e:
        return False, {"error": str(e)}


def test_model_init(languages):
    img = Image.new("RGB", (100, 50), "white")
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), "x", fill="black")
    b64 = image_to_base64(img)
    try:
        resp = requests.post(OCR_ENDPOINT, json={"image": b64, "languages": languages},
                             headers={"Content-Type": "application/json"}, timeout=120)
        if resp.status_code == 200:
            return True, None
        else:
            return False, f"HTTP {resp.status_code}: {resp.text[:300]}"
    except Exception as e:
        return False, str(e)


def run_ocr(b64_image, languages):
    try:
        start = time.perf_counter()
        resp = requests.post(OCR_ENDPOINT, json={"image": b64_image, "languages": languages},
                             headers={"Content-Type": "application/json"}, timeout=120)
        wall = (time.perf_counter() - start) * 1000
        if resp.status_code != 200:
            return {"success": False, "status": f"HTTP_{resp.status_code}", "error": resp.text[:300], "wall_time_ms": round(wall)}
        data = resp.json()
        return {"success": True, "status": "OK", "text": data.get("text", "").strip(),
                "lines": data.get("lines", []), "processing_time_ms": data.get("processing_time_ms", 0), "wall_time_ms": round(wall)}
    except Exception as e:
        return {"success": False, "status": "SERVICE_ERROR", "error": str(e), "wall_time_ms": 0}


def run_benchmark():
    print("=" * 78)
    print("  GLOBAL MULTILINGUAL EASYOCR BENCHMARK")
    print("=" * 78)
    print(f"  Service: {SERVICE_URL}")
    print(f"  Language entries: {len(TEST_CASES)}")
    print("=" * 78)
    print()

    healthy, health_data = check_health()
    if not healthy:
        print(f"[FAIL] Service unreachable: {health_data}")
        sys.exit(1)

    supported_languages = set()
    try:
        import easyocr.config as ecfg
        supported_languages = set(ecfg.all_lang_list)
    except ImportError:
        pass

    easyocr_ver = health_data.get("easyocr_version", "?")
    gpu = health_data.get("gpu_available", False)
    lang_count = health_data.get("supported_languages_count", "?")
    print(f"[OK] Service healthy: EasyOCR v{easyocr_ver}, GPU: {gpu}, Languages: {lang_count}")
    print()

    all_results = []
    total_test_num = 0

    for tc_idx, tc in enumerate(TEST_CASES, 1):
        lang_name = tc["language"]
        primary_code = tc["code"]
        script = tc["script"]
        texts = tc["texts"]
        extra_langs = tc.get("extra_langs", [])
        all_lang_codes = [primary_code] + extra_langs

        print(f"--- [{tc_idx:02d}/{len(TEST_CASES)}] {lang_name} ({script}) codes={all_lang_codes} ---")

        # 1. Language support check
        unsupported = [c for c in all_lang_codes if c not in supported_languages]
        if unsupported:
            print(f"    [UNAVAILABLE] Code(s) not supported: {unsupported}")
            for text in texts:
                total_test_num += 1
                all_results.append({"test_num": total_test_num, "language": lang_name, "code": primary_code,
                    "all_codes": all_lang_codes, "script": script, "expected_text": text, "ocr_text": "",
                    "similarity": 0.0, "confidence_avg": 0.0, "processing_time_ms": 0, "wall_time_ms": 0,
                    "http_status": "N/A", "model_init": "N/A", "font_status": "N/A", "font_name": "N/A",
                    "classification": "UNAVAILABLE", "error": f"Unsupported: {unsupported}"})
            print()
            continue

        # 2. Model init
        print(f"    Model init...", end=" ")
        model_ok, model_err = test_model_init(all_lang_codes)
        if model_ok:
            print("OK")
        else:
            print(f"FAILED: {model_err}")
            for text in texts:
                total_test_num += 1
                all_results.append({"test_num": total_test_num, "language": lang_name, "code": primary_code,
                    "all_codes": all_lang_codes, "script": script, "expected_text": text, "ocr_text": "",
                    "similarity": 0.0, "confidence_avg": 0.0, "processing_time_ms": 0, "wall_time_ms": 0,
                    "http_status": model_err[:50] if model_err else "?", "model_init": "FAILED", "font_status": "N/A",
                    "font_name": "N/A", "classification": "MODEL_ERROR", "error": model_err or "Model init failed"})
            print()
            continue

        # 3. Font discovery
        font_path, font_name, dark_px = find_best_font(script, texts[0])
        if font_path is None:
            print(f"    [FONT_UNAVAILABLE] No font renders {script}")
            for text in texts:
                total_test_num += 1
                all_results.append({"test_num": total_test_num, "language": lang_name, "code": primary_code,
                    "all_codes": all_lang_codes, "script": script, "expected_text": text, "ocr_text": "",
                    "similarity": 0.0, "confidence_avg": 0.0, "processing_time_ms": 0, "wall_time_ms": 0,
                    "http_status": "N/A", "model_init": "OK", "font_status": "UNAVAILABLE", "font_name": "N/A",
                    "classification": "FONT_UNAVAILABLE", "error": f"No font for {script}"})
            print()
            continue
        print(f"    Font: {font_name} (px={dark_px})")

        # 4. OCR each text
        for text in texts:
            total_test_num += 1
            print(f"    [{total_test_num}] Expect: {repr(text)}")

            text_dark = _validate_font_renders_text(font_path, text, 48)
            if text_dark < MIN_RENDER_PIXELS:
                print(f"        [FONT_UNAVAIL] Can't render (px={text_dark})")
                all_results.append({"test_num": total_test_num, "language": lang_name, "code": primary_code,
                    "all_codes": all_lang_codes, "script": script, "expected_text": text, "ocr_text": "",
                    "similarity": 0.0, "confidence_avg": 0.0, "processing_time_ms": 0, "wall_time_ms": 0,
                    "http_status": "N/A", "model_init": "OK", "font_status": f"FAIL(px={text_dark})",
                    "font_name": font_name, "classification": "FONT_UNAVAILABLE",
                    "error": f"Font {font_name} can't render (px={text_dark})"})
                continue

            img = generate_test_image(text, font_path, 48)
            b64 = image_to_base64(img)
            result = run_ocr(b64, all_lang_codes)

            if not result["success"]:
                print(f"        [SVC_ERR] {result.get('error', result['status'])}")
                all_results.append({"test_num": total_test_num, "language": lang_name, "code": primary_code,
                    "all_codes": all_lang_codes, "script": script, "expected_text": text, "ocr_text": "",
                    "similarity": 0.0, "confidence_avg": 0.0, "processing_time_ms": 0,
                    "wall_time_ms": result.get("wall_time_ms", 0), "http_status": result["status"],
                    "model_init": "OK", "font_status": f"OK({font_name})", "font_name": font_name,
                    "classification": "SERVICE_ERROR", "error": result.get("error", "Unknown")})
                continue

            ocr_text = result["text"]
            lines = result["lines"]
            proc_time = result["processing_time_ms"]
            sim = similarity(text, ocr_text)
            avg_conf = sum(l["confidence"] for l in lines) / len(lines) if lines else 0.0
            classification = classify_result(sim, "OK", True, True)

            print(f"        OCR: {repr(ocr_text)}")
            print(f"        Sim={sim:.0%} Conf={avg_conf:.4f} Time={proc_time}ms -> {classification}")

            all_results.append({"test_num": total_test_num, "language": lang_name, "code": primary_code,
                "all_codes": all_lang_codes, "script": script, "expected_text": text, "ocr_text": ocr_text,
                "similarity": round(sim, 4), "confidence_avg": round(avg_conf, 4),
                "processing_time_ms": proc_time, "wall_time_ms": result.get("wall_time_ms", 0),
                "http_status": "200", "model_init": "OK", "font_status": f"OK({font_name})",
                "font_name": font_name, "classification": classification, "error": None})
        print()

    # ── SUMMARY ──
    print()
    print("=" * 78)
    print("  GLOBAL BENCHMARK RESULTS SUMMARY")
    print("=" * 78)

    cls = {}
    for r in all_results:
        c = r["classification"]
        cls[c] = cls.get(c, 0) + 1

    ocr_results = [r for r in all_results if r["classification"] in ("PASS", "PARTIAL", "FAIL")]
    pc = cls.get("PASS", 0)
    pac = cls.get("PARTIAL", 0)
    fc = cls.get("FAIL", 0)

    print(f"  Total test items:       {len(all_results)}")
    print(f"  Languages tested:       {len(TEST_CASES)}")
    print(f"  PASS (>=90%):           {pc}")
    print(f"  PARTIAL (50-89%):       {pac}")
    print(f"  FAIL (<50%):            {fc}")
    print(f"  UNAVAILABLE:            {cls.get('UNAVAILABLE', 0)}")
    print(f"  FONT_UNAVAILABLE:       {cls.get('FONT_UNAVAILABLE', 0)}")
    print(f"  MODEL_ERROR:            {cls.get('MODEL_ERROR', 0)}")
    print(f"  SERVICE_ERROR:          {cls.get('SERVICE_ERROR', 0)}")

    avg_sim = avg_conf = avg_time = total_time = 0
    if ocr_results:
        avg_sim = sum(r["similarity"] for r in ocr_results) / len(ocr_results)
        avg_conf = sum(r["confidence_avg"] for r in ocr_results) / len(ocr_results)
        avg_time = sum(r["processing_time_ms"] for r in ocr_results) / len(ocr_results)
        total_time = sum(r["processing_time_ms"] for r in ocr_results)
        print(f"\n  Avg similarity (OCR):   {avg_sim:.2%}")
        print(f"  Avg confidence (OCR):   {avg_conf:.4f}")
        print(f"  Avg latency (OCR):      {avg_time:.0f}ms")
        print(f"  Total OCR time:         {total_time}ms")

    # Script family summary
    print("\n  SCRIPT FAMILY SUMMARY:")
    print("  " + "-" * 74)
    sg = {}
    for r in all_results:
        s = r["script"]
        sg.setdefault(s, []).append(r)
    for sn, rs in sorted(sg.items()):
        oc = [r for r in rs if r["classification"] in ("PASS", "PARTIAL", "FAIL")]
        p = sum(1 for r in rs if r["classification"] == "PASS")
        pa = sum(1 for r in rs if r["classification"] == "PARTIAL")
        f = sum(1 for r in rs if r["classification"] == "FAIL")
        me = sum(1 for r in rs if r["classification"] == "MODEL_ERROR")
        fu = sum(1 for r in rs if r["classification"] == "FONT_UNAVAILABLE")
        avs = sum(r["similarity"] for r in oc) / len(oc) if oc else 0
        print(f"  {sn:<15} P={p} Pa={pa} F={f} ME={me} FU={fu} AvgSim={avs:.0%}")
    print("  " + "-" * 74)

    # Per-test detail
    print("\n  PER-TEST DETAIL:")
    print("  " + "-" * 74)
    print(f"  {'#':<4} {'Language':<20} {'Script':<12} {'Sim':>5} {'Conf':>6} {'ms':>6} {'Result':<16}")
    print("  " + "-" * 74)
    for r in all_results:
        is_ocr = r["classification"] in ("PASS", "PARTIAL", "FAIL")
        ss = f"{r['similarity']:.0%}" if is_ocr else "N/A"
        cs = f"{r['confidence_avg']:.3f}" if is_ocr else "N/A"
        ts = str(r['processing_time_ms']) if is_ocr else "N/A"
        print(f"  {r['test_num']:<4} {r['language']:<20} {r['script']:<12} {ss:>5} {cs:>6} {ts:>6} {r['classification']:<16}")
    print("  " + "-" * 74)

    # Save JSON
    out = "benchmark_results.json"
    summary = {"total_tests": len(all_results), "languages_tested": len(TEST_CASES),
        "pass": pc, "partial": pac, "fail": fc, "unavailable": cls.get("UNAVAILABLE", 0),
        "font_unavailable": cls.get("FONT_UNAVAILABLE", 0), "model_error": cls.get("MODEL_ERROR", 0),
        "service_error": cls.get("SERVICE_ERROR", 0)}
    if ocr_results:
        summary.update({"avg_similarity": round(avg_sim, 4), "avg_confidence": round(avg_conf, 4), "avg_latency_ms": round(avg_time)})
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"service_url": SERVICE_URL, "easyocr_version": easyocr_ver, "gpu_available": gpu,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "summary": summary, "results": all_results},
            f, indent=2, ensure_ascii=False)
    print(f"\n  Results saved to: {out}")
    print("=" * 78)
    return all_results


if __name__ == "__main__":
    run_benchmark()
