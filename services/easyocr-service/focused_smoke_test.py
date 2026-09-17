"""
Focused Global-Language Smoke Test for Standalone EasyOCR Microservice.

Exercises:
1. RTL Scripts: Arabic (ar), Persian (fa), Urdu (ur)
2. CJK Script: Korean (ko) with balanced configuration (mag_ratio=1.5, preprocess=True)
3. Cyrillic Script: Russian (ru), Bulgarian (bg)
4. Indic Scripts: Hindi (hi), Marathi (mr), Nepali (ne), Bengali (bn), Assamese (as)
5. Upstream Known Limitation: Tamil (ta)

Does NOT run the complete 80-test benchmark.
"""

import base64
import io
import json
import os
import sys
import time
from difflib import SequenceMatcher
from PIL import Image, ImageDraw, ImageFont
import requests

sys.stdout.reconfigure(encoding='utf-8')

SERVICE_URL = "http://127.0.0.1:8088"
OCR_ENDPOINT = f"{SERVICE_URL}/ocr"
HEALTH_ENDPOINT = f"{SERVICE_URL}/health"
FONTS_DIR = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts")


def similarity(a: str, b: str) -> float:
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.strip(), b.strip()).ratio()


def create_image_b64(text: str, font_name: str, size: int = 36) -> str:
    font_path = os.path.join(FONTS_DIR, font_name)
    font = ImageFont.truetype(font_path, size)
    tmp = Image.new("RGB", (1, 1), "white")
    draw_tmp = ImageDraw.Draw(tmp)
    bbox = draw_tmp.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    w = max(tw + 80, 450)
    h = max(th + 50, 110)
    img = Image.new("RGB", (w, h), "white")
    draw = ImageDraw.Draw(img)
    x = (w - tw) // 2
    y = (h - th) // 2
    draw.text((x, y), text, fill="black", font=font)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


TEST_CASES = [
    # ── 1. RTL (Arabic, Persian, Urdu) ──
    {"group": "RTL", "lang": "Arabic", "code": "ar", "text": "صباح الخير", "baseline_sim": 0.3478, "font": "tahoma.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "RTL", "lang": "Arabic", "code": "ar", "text": "اليوم طقس جميل", "baseline_sim": 0.6000, "font": "tahoma.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "RTL", "lang": "Persian", "code": "fa", "text": "صبح بخير", "baseline_sim": 0.4444, "font": "tahoma.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "RTL", "lang": "Persian", "code": "fa", "text": "امروز هوا زيباست", "baseline_sim": 0.3636, "font": "tahoma.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "RTL", "lang": "Urdu", "code": "ur", "text": "صبح بخير", "baseline_sim": 0.4444, "font": "tahoma.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "RTL", "lang": "Urdu", "code": "ur", "text": "آج موسم اچھا ہے", "baseline_sim": 0.3333, "font": "tahoma.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},

    # ── 2. CJK (Korean) ──
    {"group": "CJK", "lang": "Korean", "code": "ko", "text": "좋은 아침입니다", "baseline_sim": 0.0000, "font": "malgun.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "CJK", "lang": "Korean", "code": "ko", "text": "오늘 날씨가 좋습니다", "baseline_sim": 0.1667, "font": "malgun.ttf", "opts": {"preprocess": True, "mag_ratio": 1.5}},

    # ── 3. Cyrillic (Russian, Bulgarian) ──
    {"group": "Cyrillic", "lang": "Russian", "code": "ru", "text": "Доброе утро", "baseline_sim": 0.0000, "font": "arial.ttf", "opts": {}},
    {"group": "Cyrillic", "lang": "Russian", "code": "ru", "text": "Сегодня хороший день", "baseline_sim": 0.0000, "font": "arial.ttf", "opts": {}},
    {"group": "Cyrillic", "lang": "Bulgarian", "code": "bg", "text": "Днес е хубав ден", "baseline_sim": 0.6875, "font": "arial.ttf", "opts": {}},

    # ── 4. Indic (Hindi, Marathi, Nepali, Bengali, Assamese) ──
    {"group": "Indic", "lang": "Hindi", "code": "hi", "text": "सुप्रभातम्", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {}},
    {"group": "Indic", "lang": "Hindi", "code": "hi", "text": "आज मौसम अच्छा है", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {}},
    {"group": "Indic", "lang": "Marathi", "code": "mr", "text": "सुप्रभात", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "Indic", "lang": "Nepali", "code": "ne", "text": "शुभप्रभात", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {"preprocess": True, "mag_ratio": 1.5}},
    {"group": "Indic", "lang": "Bengali", "code": "bn", "text": "শুভ সকাল", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {}},
    {"group": "Indic", "lang": "Assamese", "code": "as", "text": "শুভ প্ৰভাত", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {"preprocess": True, "mag_ratio": 1.5}},

    # ── 5. Known Upstream Checkpoint Mismatch ──
    {"group": "Upstream Defect", "lang": "Tamil", "code": "ta", "text": "வணக்கம்", "baseline_sim": 0.0000, "font": "Nirmala.ttc", "opts": {}}
]


def run_tests():
    print("=" * 80)
    print("  STANDALONE EASYOCR - TARGETED GLOBAL-LANGUAGE SMOKE TEST")
    print("=" * 80)

    # Health check
    h = requests.get(HEALTH_ENDPOINT, timeout=5)
    print(f"Health Status: {h.status_code} | Service: {h.json().get('service')}")
    print("-" * 80)

    results = []

    for item in TEST_CASES:
        grp = item["group"]
        lang = item["lang"]
        code = item["code"]
        text = item["text"]
        base_sim = item["baseline_sim"]
        font_name = item["font"]
        opts = item["opts"]

        b64 = create_image_b64(text, font_name)
        payload = {"image": b64, "languages": [code]}
        payload.update(opts)

        t0 = time.perf_counter()
        resp = requests.post(OCR_ENDPOINT, json=payload, timeout=60)
        dur = int((time.perf_counter() - t0) * 1000)

        if resp.status_code == 200:
            data = resp.json()
            rec = data.get("text", "")
            raw = data.get("raw_text", "")
            sim = similarity(text, rec)
            status = "PASS" if sim >= 0.70 else "PARTIAL" if sim >= 0.40 else "FAIL"
            print(f"[{grp:<14}] {lang:<10} ({code}): {status:<7} | Now: {sim:<7.2%} (Was: {base_sim:<7.2%}) | {dur}ms")
            print(f"   Expected:   '{text}'")
            print(f"   Normalized: '{rec}'")
            if raw and raw != rec:
                print(f"   Raw OCR:    '{raw}'")
            results.append({
                "group": grp, "lang": lang, "code": code, "text": text,
                "baseline_sim": base_sim, "sim": sim, "status": status,
                "recognized": rec, "raw": raw, "dur_ms": dur
            })
        elif resp.status_code == 500 and code == "ta":
            print(f"[{grp:<14}] {lang:<10} ({code}): MODEL_ERROR (Upstream shape mismatch) | {dur}ms")
            results.append({
                "group": grp, "lang": lang, "code": code, "text": text,
                "baseline_sim": base_sim, "sim": 0.0, "status": "MODEL_ERROR",
                "note": "Confirmed upstream architecture mismatch (143 vs 127)", "dur_ms": dur
            })
        else:
            print(f"[{grp:<14}] {lang:<10} ({code}): HTTP_{resp.status_code} | {dur}ms")
            results.append({
                "group": grp, "lang": lang, "code": code, "text": text,
                "baseline_sim": base_sim, "sim": 0.0, "status": f"HTTP_{resp.status_code}", "dur_ms": dur
            })

    print("\n" + "=" * 80)
    print("  SUMMARY: BEFORE vs AFTER REMEDIATION")
    print("=" * 80)
    print(f"{'Language':<12} {'Code':<6} {'Baseline Sim':<15} {'Post-Fix Sim':<15} {'Status':<12}")
    print("-" * 65)
    for r in results:
        status_str = r['status']
        sim_str = f"{r['sim']:.2%}" if r['status'] != "MODEL_ERROR" else "N/A"
        print(f"{r['lang']:<12} {r['code']:<6} {r['baseline_sim']:<15.2%} {sim_str:<15} {status_str:<12}")
    print("=" * 80)


if __name__ == "__main__":
    run_tests()
