# backend/routes/surplus.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import datetime

router = APIRouter(prefix="/surplus", tags=["Surplus & NGO"])

# 1. List Available Donations (For NGOs)
@router.get("/available")
def get_available_donations(db: Session = Depends(get_db)):
    """
    Shows batches that farmers have marked for donation.
    """
    return db.query(models.Batch).filter(models.Batch.status == "DONATION_READY").all()

# 2. Farmer Donates a Batch
@router.post("/donate/{batch_id}")
def donate_batch(batch_id: str, db: Session = Depends(get_db)):
    """
    Farmer marks a batch as 'Surplus/Donation'. 
    This triggers an 'Impact Token' reward.
    """
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # Update Status
    batch.status = "DONATION_READY"
    
    # REWARD LOGIC: Give Farmer Impact Tokens
    # (In real life, this calls the Blockchain Contract)
    if batch.owner:
        batch.owner.impact_tokens += 50 
        
    db.commit()
    return {"message": "Batch marked for donation", "impact_tokens_earned": 50}

# 3. NGO Claims a Batch
@router.post("/claim/{batch_id}")
def claim_donation(batch_id: str, ngo_id: int, db: Session = Depends(get_db)):
    """
    NGO claims the food.
    """
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    batch.status = "DISTRIBUTED"
    
    # Log the event
    new_event = models.BatchEvent(
        batch_id=batch.id,
        event_type="DONATION",
        description=f"Claimed by NGO #{ngo_id}",
        timestamp=datetime.datetime.utcnow()
    )
    db.add(new_event)
    db.commit()
    
    return {"message": "Donation claimed successfully"}