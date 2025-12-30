from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Farmer
from schemas import FarmerCreate, FarmerOut, TokenBalance

router = APIRouter(prefix="/farmers", tags=["farmers"])


@router.post("/register", response_model=FarmerOut)
def register_farmer(payload: FarmerCreate, db: Session = Depends(get_db)):
    farmer = Farmer(
        name=payload.name,
        location=payload.location,
        farm_size=payload.farm_size,
        wallet_address=payload.wallet_address,
        tokens=0,
    )
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get("/tokens/{farmer_id}", response_model=TokenBalance)
def get_tokens(farmer_id: int, db: Session = Depends(get_db)):
    farmer = db.get(Farmer, farmer_id)
    if not farmer:
        return TokenBalance(farmer_id=farmer_id, tokens=0)
    return TokenBalance(farmer_id=farmer.id, tokens=farmer.tokens)



