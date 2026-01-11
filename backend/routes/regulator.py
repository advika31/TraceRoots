# /backend/routes/regulator.py

OVER_HARVEST_THRESHOLD_KG = 500

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import FoodBatch, Farmer, LabTest
from utils.blockchain_utils import verify_batch_onchain

router = APIRouter(prefix="/regulator", tags=["regulator"])


@router.get("/batch/{batch_id}")
def regulator_batch_lookup(batch_id: int, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    farmer = db.get(Farmer, batch.farmer_id)

    lab_test = (
        db.query(LabTest)
        .filter(LabTest.batch_id == batch.id)
        .first()
    )

    return {
        "batch_id": batch.id,
        "crop_type": batch.crop_type,
        "quantity_kg": batch.quantity_kg,
        "status": batch.status,
        "farmer": {
            "id": farmer.id if farmer else None,
            "name": farmer.name if farmer else "Unknown",
            "location": farmer.location if farmer else None,
        },
        "lab_test": {
            "purity_percent": lab_test.purity_percent,
            "heavy_metals_safe": lab_test.heavy_metals_safe,
            "pesticides_safe": lab_test.pesticides_safe,
            "remarks": lab_test.remarks,
            "tested_at": lab_test.tested_at,
        } if lab_test else None,
        "blockchain_tx": batch.blockchain_tx,
    }

@router.get("/verify/{batch_id}")
def verify_batch_authenticity(batch_id: int, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    farmer = db.get(Farmer, batch.farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    try:
        is_valid = verify_batch_onchain(
            batch_id=batch.id,
            crop_type=batch.crop_type,
            quantity_kg=batch.quantity_kg,
            farmer_wallet=farmer.wallet_address,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "batch_id": batch.id,
        "on_chain_verified": is_valid,
        "blockchain_tx": batch.blockchain_tx,
        "status": batch.status
    }

@router.get("/alerts")
def regulator_alerts(db: Session = Depends(get_db)):
    alerts = []

    farmers = db.query(Farmer).all()

    for farmer in farmers:
        total_harvested = (
            db.query(FoodBatch)
            .filter(
                FoodBatch.farmer_id == farmer.id,
                FoodBatch.status.in_(["approved", "distributed"])
            )
            .with_entities(FoodBatch.quantity_kg)
            .all()
        )

        total_kg = sum(q[0] for q in total_harvested)

        if total_kg > OVER_HARVEST_THRESHOLD_KG:
            alerts.append({
                "farmer_id": farmer.id,
                "farmer_name": farmer.name,
                "total_harvested_kg": total_kg,
                "threshold_kg": OVER_HARVEST_THRESHOLD_KG,
                "severity": "high"
            })

    return {
        "alerts_count": len(alerts),
        "alerts": alerts
    }
