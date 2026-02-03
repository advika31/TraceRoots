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
    Disabled: Donations are system-triggered when a batch nears expiry.
    """
    raise HTTPException(status_code=400, detail="Donations are auto-triggered when batches near expiry.")

@router.post("/scan-expiring")
def scan_expiring_batches(db: Session = Depends(get_db)):
    """
    System scan to flag near-expiry batches and notify NGOs.
    """
    now = datetime.datetime.utcnow()
    soon = now + datetime.timedelta(days=2)
    batches = db.query(models.Batch).filter(
        models.Batch.expiry_date != None,
        models.Batch.expiry_date <= soon,
        models.Batch.status.notin_(["SOLD", "DISTRIBUTED", "DONATION_READY"])
    ).all()

    ngos = db.query(models.User).filter(models.User.role == "NGO").all()
    flagged = []
    for batch in batches:
        batch.status = "DONATION_READY"
        flagged.append(batch.batch_id)
        if batch.owner:
            batch.owner.impact_tokens += 20
            db.add(models.Notification(
                user_id=batch.owner.id,
                type=models.NotificationType.INFO,
                sender="System",
                priority="Normal",
                message=f"Batch {batch.batch_id} flagged for donation. +20 Impact Tokens."
            ))
        for ngo in ngos:
            db.add(models.Notification(
                user_id=ngo.id,
                type=models.NotificationType.ALERT,
                sender="System",
                priority="Important",
                message=f"Donation ready: Batch {batch.batch_id} ({batch.crop_name}, {batch.quantity}kg)."
            ))
    db.commit()
    return {"flagged_batches": flagged, "count": len(flagged)}

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
    if batch.owner:
        db.add(models.Notification(
            user_id=batch.owner.id,
            type=models.NotificationType.SUCCESS,
            sender="NGO",
            priority="Normal",
            message=f"NGO claimed batch {batch.batch_id}. Thank you for reducing waste."
        ))
    db.commit()
    
    return {"message": "Donation claimed successfully"}
