# /backend/routes/regulator.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

router = APIRouter(prefix="/regulator", tags=["Regulator"])

# --- SUSTAINABILITY MAP DATA ---
@router.get("/map-data")
def get_sustainability_map(db: Session = Depends(get_db)):
    """
    Returns all batches with their location and calculated 'Stress Level'.
    If many farmers harvest in the same region, it flags as 'RED' (Over-farming).
    """
    batches = db.query(models.Batch).all()
    map_points = []
    
    region_counts = {}
    for b in batches:
        region = b.region or "Unknown"
        region_counts[region] = region_counts.get(region, 0) + 1

    for batch in batches:
        count = region_counts.get(batch.region, 0)
        status_color = "RED" if count > 5 else "GREEN"
        
        map_points.append({
            "batch_id": batch.batch_id,
            "lat": batch.latitude or 30.73, # Default to Chandigarh if missing
            "lng": batch.longitude or 76.77,
            "crop": batch.crop_name,
            "farmer": batch.owner.full_name if batch.owner else "Unknown",
            "zone_status": status_color,
            "stress_score": count * 10 # Mock score
        })
    
    return map_points

# --- ALERTS & NOTIFICATIONS ---
@router.get("/alerts")
def get_recent_alerts(db: Session = Depends(get_db)):
    """
    Returns alerts for the Regulator Dashboard.
    """
    return [
        {"id": 1, "level": "HIGH", "msg": "Detected 500kg Wheat over-harvest in Zone-1"},
        {"id": 2, "level": "MEDIUM", "msg": "Unexpected water usage spike in Punjab-North"},
        {"id": 3, "level": "LOW", "msg": "New farmer registration pending verification"}
    ]