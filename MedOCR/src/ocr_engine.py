"""Google Cloud Vision API OCR engine for handwritten prescriptions."""

import base64
import os
import time
import requests
from dotenv import load_dotenv
from typing import Optional

load_dotenv()
VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate"


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def detect_handwriting(image_path: str, api_key: Optional[str] = None, max_retries: int = 3) -> dict:
    key = api_key or os.getenv("GOOGLE_API_KEY")
    if not key:
        raise ValueError("No API key found. Set GOOGLE_API_KEY in .env")

    body = {
        "requests": [{
            "image": {"content": encode_image(image_path)},
            "features": [{"type": "DOCUMENT_TEXT_DETECTION", "model": "builtin/latest"}],
            "imageContext": {"languageHints": ["en"]},
        }]
    }

    for attempt in range(max_retries):
        response = requests.post(f"{VISION_API_URL}?key={key}", json=body, timeout=30)
        if response.status_code == 200:
            return response.json()
        if response.status_code == 403 and attempt < max_retries - 1:
            time.sleep(3)
            continue
        if response.status_code == 429 and attempt < max_retries - 1:
            time.sleep((attempt + 1) * 3)
            continue
        raise RuntimeError(f"Vision API error {response.status_code}: {response.text}")

    raise RuntimeError("Vision API failed after retries.")


def extract_full_text(api_response: dict) -> str:
    responses = api_response.get("responses", [])
    if not responses:
        return ""
    return responses[0].get("fullTextAnnotation", {}).get("text", "")