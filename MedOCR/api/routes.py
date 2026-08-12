"""FastAPI routes for prescription OCR prediction."""

import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from api.schemas import PredictResponse, HealthResponse
from src.predictor import predict_medicine, load_medicine_db, build_medicine_db
from src.utils import setup_logger

logger = setup_logger("api")
router = APIRouter()

DB_PATH = "models/medicine_db.json"
TRAIN_CSV = "data/RxHandBD-ML/Train/Test_Label.csv"

if not os.path.exists(DB_PATH):
    if os.path.exists(TRAIN_CSV):
        logger.info("Building medicine database from training CSV...")
        build_medicine_db(TRAIN_CSV, DB_PATH)
    else:
        logger.warning(f"Training CSV not found at {TRAIN_CSV}")

medicine_db = []
if os.path.exists(DB_PATH):
    medicine_db = load_medicine_db(DB_PATH)
    logger.info(f"Loaded medicine DB: {len(medicine_db)} medicines")
else:
    logger.warning("Medicine DB not found. /predict will not work.")


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", medicine_db_size=len(medicine_db))


@router.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    if not medicine_db:
        raise HTTPException(status_code=500, detail="Medicine database not loaded.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = predict_medicine(tmp_path, medicine_db)
        return PredictResponse(
            matched_medicine=result["matched_medicine"],
            confidence=result["confidence"],
            cleaned_text=result["cleaned_text"],
            raw_text=result["raw_text"],
            all_matches=result["all_matches"],
        )
    finally:
        os.unlink(tmp_path)