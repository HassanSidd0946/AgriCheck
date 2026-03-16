"""
AgriCheck – Crop Recommendation Endpoint  (v2 – Live Sensor Integration)
File: app/routers/crop_recommendation.py

Flow:
  ESP32  →  POST /readings/  →  DB  →  GET /api/v1/recommend-crops  →  Top-3 Crops
  
No query parameters needed. Data is pulled automatically from the latest DB reading.
"""

from __future__ import annotations

import os
import json
import logging
from typing import List

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..crud import sensor as crud

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic response schemas
# ─────────────────────────────────────────────────────────────────────────────

class SensorSnapshot(BaseModel):
    """The live sensor values that were used for this recommendation."""
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    temperature: float
    humidity: float
    ec: float
    reading_id: int
    timestamp: str


class CropRecommendation(BaseModel):
    rank: int
    name: str
    reason: str


class RecommendationResponse(BaseModel):
    status: str
    sensor_data: SensorSnapshot        # ← shows which reading was used
    recommendations: List[CropRecommendation]
    summary: str                       # ← single combined message


# ─────────────────────────────────────────────────────────────────────────────
# Agronomic knowledge base  (Pakistani context)
# ─────────────────────────────────────────────────────────────────────────────

CROP_PROFILES: dict[str, dict] = {

    # ── Major Kharif Crops (Summer) ───────────────────────────────────────────
    "Rice": {
        "n":           (80,  120),
        "p":           (30,   60),
        "k":           (30,   60),
        "ph":          (5.5,  6.5),
        "humidity":    (70,   90),
        "temperature": (20,   35),
        "ec":          (0.3,  1.5),
    },
    "Cotton": {
        "n":           (60,  120),
        "p":           (30,   60),
        "k":           (40,   80),
        "ph":          (6.0,  8.0),
        "humidity":    (40,   70),
        "temperature": (25,   38),
        "ec":          (0.5,  3.0),
    },
    "Maize": {
        "n":           (100, 150),
        "p":           (40,   70),
        "k":           (40,   70),
        "ph":          (5.8,  7.0),
        "humidity":    (50,   80),
        "temperature": (18,   32),
        "ec":          (0.5,  2.5),
    },
    "Sugarcane": {
        "n":           (100, 180),
        "p":           (40,   80),
        "k":           (80,  150),
        "ph":          (6.0,  7.5),
        "humidity":    (65,   90),
        "temperature": (25,   38),
        "ec":          (0.5,  2.5),
    },
    "Sorghum (Jowar)": {
        "n":           (60,  100),
        "p":           (30,   50),
        "k":           (30,   50),
        "ph":          (5.5,  7.5),
        "humidity":    (30,   70),
        "temperature": (25,   38),
        "ec":          (0.5,  4.0),   # drought & salt tolerant
    },
    "Millet (Bajra)": {
        "n":           (40,   80),
        "p":           (20,   40),
        "k":           (20,   40),
        "ph":          (5.5,  7.0),
        "humidity":    (25,   60),
        "temperature": (25,   38),
        "ec":          (0.5,  3.5),
    },
    "Sesame (Til)": {
        "n":           (40,   70),
        "p":           (25,   45),
        "k":           (25,   45),
        "ph":          (5.5,  7.5),
        "humidity":    (30,   60),
        "temperature": (25,   35),
        "ec":          (0.5,  2.5),
    },
    "Mung Bean (Moong)": {
        "n":           (20,   40),   # fixes its own N
        "p":           (40,   60),
        "k":           (30,   50),
        "ph":          (6.0,  7.5),
        "humidity":    (50,   80),
        "temperature": (25,   35),
        "ec":          (0.3,  2.0),
    },
    "Moth Bean (Mash)": {
        "n":           (20,   40),
        "p":           (35,   55),
        "k":           (30,   50),
        "ph":          (6.0,  7.5),
        "humidity":    (40,   70),
        "temperature": (25,   35),
        "ec":          (0.3,  2.5),
    },

    # ── Major Rabi Crops (Winter) ─────────────────────────────────────────────
    "Wheat": {
        "n":           (80,  120),
        "p":           (40,   60),
        "k":           (40,   60),
        "ph":          (6.0,  7.5),
        "humidity":    (50,   70),
        "temperature": (10,   25),
        "ec":          (0.5,  2.0),
    },
    "Mustard (Sarson)": {
        "n":           (60,  100),
        "p":           (30,   50),
        "k":           (30,   50),
        "ph":          (5.8,  7.0),
        "humidity":    (40,   65),
        "temperature": (10,   25),
        "ec":          (0.5,  2.5),
    },
    "Chickpea (Chanay)": {
        "n":           (20,   40),   # fixes its own N
        "p":           (40,   60),
        "k":           (30,   50),
        "ph":          (6.0,  8.0),
        "humidity":    (30,   60),
        "temperature": (10,   25),
        "ec":          (0.3,  3.0),
    },
    "Lentil (Masoor)": {
        "n":           (20,   40),
        "p":           (35,   55),
        "k":           (25,   45),
        "ph":          (6.0,  8.0),
        "humidity":    (35,   65),
        "temperature": (10,   25),
        "ec":          (0.3,  2.5),
    },
    "Barley (Jau)": {
        "n":           (60,  100),
        "p":           (30,   50),
        "k":           (30,   50),
        "ph":          (6.0,  8.5),
        "humidity":    (40,   65),
        "temperature": (8,    22),
        "ec":          (0.5,  5.0),   # very salt tolerant
    },

    # ── Vegetables ────────────────────────────────────────────────────────────
    "Potato": {
        "n":           (100, 150),
        "p":           (60,  100),
        "k":           (80,  130),
        "ph":          (5.0,  6.5),
        "humidity":    (60,   80),
        "temperature": (15,   25),
        "ec":          (0.5,  2.0),
    },
    "Tomato": {
        "n":           (80,  120),
        "p":           (50,   80),
        "k":           (60,  100),
        "ph":          (5.5,  7.0),
        "humidity":    (50,   75),
        "temperature": (18,   30),
        "ec":          (0.5,  2.5),
    },
    "Onion (Pyaaz)": {
        "n":           (60,  100),
        "p":           (40,   60),
        "k":           (50,   80),
        "ph":          (6.0,  7.0),
        "humidity":    (50,   70),
        "temperature": (13,   24),
        "ec":          (0.5,  1.5),
    },
    "Chilli": {
        "n":           (80,  120),
        "p":           (40,   70),
        "k":           (50,   90),
        "ph":          (5.5,  7.0),
        "humidity":    (50,   75),
        "temperature": (20,   32),
        "ec":          (0.5,  2.0),
    },
    "Garlic (Lehsan)": {
        "n":           (60,  100),
        "p":           (40,   60),
        "k":           (50,   80),
        "ph":          (6.0,  7.5),
        "humidity":    (50,   70),
        "temperature": (12,   24),
        "ec":          (0.5,  2.0),
    },
    "Spinach (Palak)": {
        "n":           (80,  120),
        "p":           (30,   50),
        "k":           (40,   70),
        "ph":          (6.0,  7.5),
        "humidity":    (50,   80),
        "temperature": (10,   20),
        "ec":          (0.5,  2.0),
    },

    # ── Oilseeds & Cash Crops ─────────────────────────────────────────────────
    "Sunflower": {
        "n":           (60,  100),
        "p":           (40,   60),
        "k":           (40,   60),
        "ph":          (6.0,  7.5),
        "humidity":    (40,   65),
        "temperature": (20,   30),
        "ec":          (0.5,  2.5),
    },
    "Canola (Toria)": {
        "n":           (70,  110),
        "p":           (30,   50),
        "k":           (30,   50),
        "ph":          (5.5,  7.0),
        "humidity":    (40,   65),
        "temperature": (10,   20),
        "ec":          (0.5,  2.5),
    },
    "Groundnut (Mungphali)": {
        "n":           (20,   40),
        "p":           (40,   70),
        "k":           (50,   90),
        "ph":          (5.5,  7.0),
        "humidity":    (50,   75),
        "temperature": (22,   35),
        "ec":          (0.3,  2.0),
    },
}

PARAM_WEIGHTS = {
    "ph":          3.0,   # most critical – wrong pH locks out all nutrients
    "temperature": 2.5,
    "humidity":    2.0,
    "n":           1.5,
    "ec":          1.5,
    "p":           1.0,
    "k":           1.0,
}


# ─────────────────────────────────────────────────────────────────────────────
# Scoring helpers
# ─────────────────────────────────────────────────────────────────────────────

def _param_score(value: float, low: float, high: float) -> float:
    """1.0 inside range, linear decay to 0.0 outside."""
    if low <= value <= high:
        return 1.0
    margin = (high - low) * 0.5 or 1.0
    if value < low:
        return max(0.0, 1.0 - (low - value) / margin)
    return max(0.0, 1.0 - (value - high) / margin)


def _build_reason(crop: str, sensor: dict[str, float]) -> str:
    """Short human-readable reason string."""
    profile = CROP_PROFILES[crop]
    label_map = {
        "ph": "pH", "n": "Nitrogen", "p": "Phosphorus",
        "k": "Potassium", "humidity": "Humidity",
        "temperature": "Temperature", "ec": "EC",
    }
    positives, negatives = [], []
    for param, (lo, hi) in profile.items():
        (positives if lo <= sensor[param] <= hi else negatives).append(label_map[param])

    parts = []
    if positives:
        parts.append(f"{', '.join(positives[:3])} within optimal range")
    if negatives:
        parts.append(f"{', '.join(negatives[:2])} slightly outside ideal range")
    return "; ".join(parts) if parts else "Conditions are broadly suitable."


def score_crops_locally(sensor: dict[str, float]) -> list[dict]:
    """Weighted scoring → top-3 ranked list."""
    scores = []
    for crop, profile in CROP_PROFILES.items():
        total_w = weighted_s = 0.0
        for param, (lo, hi) in profile.items():
            w = PARAM_WEIGHTS.get(param, 1.0)
            weighted_s += w * _param_score(sensor[param], lo, hi)
            total_w += w
        scores.append((crop, (weighted_s / total_w) * 100))

    scores.sort(key=lambda x: x[1], reverse=True)
    return [
        {"rank": i + 1, "name": name, "reason": _build_reason(name, sensor)}
        for i, (name, _) in enumerate(scores[:3])
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Optional LLM enrichment via Anthropic API
# Set ANTHROPIC_API_KEY in your .env — silently skipped if absent
# ─────────────────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_URL     = "https://api.anthropic.com/v1/messages"
LLM_MODEL         = "claude-sonnet-4-20250514"


async def _enrich_with_llm(sensor: dict[str, float], local_top3: list[dict]) -> list[dict]:
    """Replace generic reasons with AI-generated agronomic reasons. Falls back silently."""
    if not ANTHROPIC_API_KEY:
        return local_top3

    prompt = (
        "You are an expert agronomist for Pakistani farming conditions.\n"
        "Live 7-in-1 soil sensor readings:\n"
        f"  Nitrogen (N): {sensor['n']} kg/ha\n"
        f"  Phosphorus (P): {sensor['p']} kg/ha\n"
        f"  Potassium (K): {sensor['k']} kg/ha\n"
        f"  pH: {sensor['ph']}\n"
        f"  Humidity: {sensor['humidity']} %\n"
        f"  Temperature: {sensor['temperature']} °C\n"
        f"  EC: {sensor['ec']} dS/m\n\n"
        "Scoring model ranked these top-3 crops:\n"
        + "\n".join(f"  {c['rank']}. {c['name']}" for c in local_top3)
        + "\n\nFor each crop write ONE concise sentence (max 20 words) explaining WHY "
        "it suits these exact sensor values. "
        "Reply ONLY with a JSON array, no markdown:\n"
        '[{"rank":1,"name":"...","reason":"..."},{"rank":2,...},{"rank":3,...}]'
    )

    try:
        async with httpx.AsyncClient(timeout=12) as client:
            resp = await client.post(
                ANTHROPIC_URL,
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": LLM_MODEL,
                    "max_tokens": 300,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
        resp.raise_for_status()
        enriched = json.loads(resp.json()["content"][0]["text"].strip())
        if (
            isinstance(enriched, list) and len(enriched) == 3
            and all({"rank", "name", "reason"} <= set(c) for c in enriched)
        ):
            return enriched
    except Exception as exc:
        logger.warning("LLM enrichment failed (%s) — using local reasons.", exc)

    return local_top3


# ─────────────────────────────────────────────────────────────────────────────
# Router
# ─────────────────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/api/v1", tags=["Crop Recommendation"])


@router.get(
    "/recommend-crops",
    response_model=RecommendationResponse,
    summary="Top-3 crop recommendations from latest live sensor reading",
    description=(
        "No parameters needed. Automatically fetches the most recent ESP32 sensor "
        "reading from the database and returns the top-3 suitable crops ranked by "
        "agronomic fit."
    ),
)
async def recommend_crops(db: Session = Depends(get_db)):
    # ── Step 1: Fetch latest reading from DB (same function your sensor router uses)
    reading = crud.get_latest_reading(db=db)
    if not reading:
        raise HTTPException(
            status_code=404,
            detail="No sensor readings found. Make sure the ESP32 is sending data."
        )

    # ── Step 2: Map DB model fields → internal sensor dict
    sensor = {
        "n":           reading.nitrogen,
        "p":           reading.phosphorus,
        "k":           reading.potassium,
        "ph":          reading.ph,
        "humidity":    reading.humidity,
        "temperature": reading.temperature,
        "ec":          reading.ec,
    }

    # ── Step 3: Score crops locally (fast, no I/O)
    local_top3 = score_crops_locally(sensor)

    # ── Step 4: Optionally enrich reasons with LLM (skipped if no API key)
    final_top3 = await _enrich_with_llm(sensor, local_top3)

    # Step 5: Build summary string
    medals = ["🥇", "🥈", "🥉"]
    summary = "\n".join(
        f"{medals[i]} {c['name']} — {c['reason']}"
        for i, c in enumerate(final_top3)
    )

    # Step 6: Return response with summary
    return RecommendationResponse(
        status="success",
        summary=summary,
        sensor_data=SensorSnapshot(
            nitrogen=reading.nitrogen,
            phosphorus=reading.phosphorus,
            potassium=reading.potassium,
            ph=reading.ph,
            temperature=reading.temperature,
            humidity=reading.humidity,
            ec=reading.ec,
            reading_id=reading.id,
            timestamp=str(reading.timestamp),
        ),
        recommendations=[CropRecommendation(**c) for c in final_top3],
    )