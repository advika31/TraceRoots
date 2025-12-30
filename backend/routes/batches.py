# /backend/routes/batches.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import FoodBatch, Farmer
from schemas import FoodBatchCreate, FoodBatchOut
from utils.ai_utils import predict_nutrition
from utils.blockchain_utils import register_batch_onchain
from utils.qr_utils import generate_qr

router = APIRouter(prefix="/batches", tags=["batches"])


@router.post("/add", response_model=FoodBatchOut)
def add_batch(payload: FoodBatchCreate, db: Session = Depends(get_db)):
    farmer = db.get(Farmer, payload.farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    batch = FoodBatch(
        farmer_id=payload.farmer_id,
        crop_type=payload.crop_type,
        quantity_kg=payload.quantity_kg,
        status="pending",
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    # AI prediction
    batch.nutrition_score = predict_nutrition(batch.crop_type)

    # Simulated blockchain
    batch.blockchain_tx = register_batch_onchain(
    batch.id,
    batch.crop_type,
    batch.quantity_kg,
    farmer.wallet_address
)
    # QR generation
    qr_data = {
        "batch_id": batch.id,
        "farmer_id": batch.farmer_id,
        "crop_type": batch.crop_type,
        "nutrition_score": batch.nutrition_score,
        "blockchain_tx": batch.blockchain_tx,
    }
    batch.qr_path = generate_qr(batch.id, qr_data)

    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


@router.get("/all", response_model=list[FoodBatchOut])
def list_batches(db: Session = Depends(get_db)):
    return db.query(FoodBatch).order_by(FoodBatch.id.desc()).all()


@router.get("/{batch_id}", response_model=FoodBatchOut)
def get_batch(batch_id: int, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch



