# /backend/routes/surplus.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Surplus, FoodBatch, Farmer
from schemas import SurplusCreate, SurplusOut

from utils.blockchain_utils import mint_tokens

router = APIRouter(prefix="/surplus", tags=["surplus"])


@router.post("/redistribute", response_model=SurplusOut)
def redistribute_surplus(payload: SurplusCreate, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, payload.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if batch.status == "distributed":
        raise HTTPException(status_code=400, detail="Batch already distributed")

    surplus = Surplus(batch_id=batch.id, ngo_name=payload.ngo_name)
    batch.status = "distributed"

    farmer = db.get(Farmer, batch.farmer_id)
    if farmer:
        mint_tokens(farmer.wallet_address, 10)
        db.add(farmer)

    db.add(batch)
    db.add(surplus)
    db.commit()
    db.refresh(surplus)
    return surplus



