# /backend/routes/processor.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import FoodBatch, Farmer, LabTest
from schemas import LabTestCreate, BatchStatusUpdate
from utils.blockchain_utils import register_batch_onchain

router = APIRouter(prefix="/processor", tags=["processor"])

@router.get("/batches")
def get_batches_for_processor(db: Session = Depends(get_db)):
    batches = (
        db.query(FoodBatch)
        .order_by(FoodBatch.id.desc())
        .all()
    )

    response = []
    for batch in batches:
        farmer = db.get(Farmer, batch.farmer_id)
        response.append({
            "batch_id": batch.id,
            "crop_type": batch.crop_type,
            "quantity_kg": batch.quantity_kg,
            "status": batch.status,
            "farmer_name": farmer.name if farmer else "Unknown"
        })

    return response

@router.post("/lab-test")
def upload_lab_test(payload: LabTestCreate, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, payload.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # prevent duplicate test
    existing = (
        db.query(LabTest)
        .filter(LabTest.batch_id == payload.batch_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Lab test already uploaded")

    lab = LabTest(
        batch_id=payload.batch_id,
        purity_percent=payload.purity_percent,
        heavy_metals_safe=payload.heavy_metals_safe,
        pesticides_safe=payload.pesticides_safe,
        remarks=payload.remarks,
    )

    batch.status = "processed"

    db.add(lab)
    db.add(batch)
    db.commit()
    db.refresh(lab)

    return {"message": "Lab test uploaded successfully"}

@router.post("/sync-blockchain/{batch_id}")
def sync_batch_to_blockchain(batch_id: int, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if batch.status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Only approved batches can be synced to blockchain"
        )

    if batch.blockchain_tx:
        return {
            "message": "Batch already synced",
            "blockchain_tx": batch.blockchain_tx
        }

    farmer = db.get(Farmer, batch.farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    try:
        tx_hash = register_batch_onchain(
            batch.id,
            batch.crop_type,
            batch.quantity_kg,
            farmer.wallet_address
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    batch.blockchain_tx = tx_hash
    db.add(batch)
    db.commit()

    return {
        "message": "Batch successfully synced to blockchain",
        "blockchain_tx": tx_hash
    }

@router.patch("/batch-status")
def update_batch_status(payload: BatchStatusUpdate, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, payload.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    valid_transitions = {
        "pending": ["processed"],
        "processed": ["approved"],
    }

    if batch.status not in valid_transitions:
        raise HTTPException(status_code=400, detail="Invalid current status")

    if payload.new_status not in valid_transitions[batch.status]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from {batch.status} to {payload.new_status}"
        )

    batch.status = payload.new_status
    db.add(batch)
    db.commit()

    return {
        "message": "Batch status updated",
        "batch_id": batch.id,
        "status": batch.status
    }
