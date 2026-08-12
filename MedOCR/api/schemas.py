"""Pydantic schemas for API request/response."""

from pydantic import BaseModel
from typing import Optional


class PredictResponse(BaseModel):
    matched_medicine: Optional[str]
    confidence: int
    cleaned_text: str
    raw_text: str
    all_matches: list


class HealthResponse(BaseModel):
    status: str
    medicine_db_size: int