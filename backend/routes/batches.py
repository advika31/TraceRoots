# backend/routes/batches.py
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid
import datetime
from database import get_db
import models
import schemas

router = APIRouter(prefix="/batches", tags=["Batches"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/all", response_model=List[schemas.Batch])
def get_all_batches(db: Session = Depends(get_db)):
    return db.query(models.Batch).order_by(models.Batch.harvest_date.desc()).all()

@router.post("/create", response_model=schemas.Batch)
def create_batch(
    farmer_id: int = Form(...),
    crop_name: str = Form(...),
    quantity: float = Form(...),
    location: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Parse Location
    lat, lng = 0.0, 0.0
    try:
        parts = location.split(",")
        lat = float(parts[0])
        lng = float(parts[1])
    except:
        pass 

    # 2. Create Batch
    new_batch_id = str(uuid.uuid4())[:8]
    db_batch = models.Batch(
        batch_id=new_batch_id,
        farmer_id=farmer_id,
        crop_name=crop_name,
        quantity=quantity,
        latitude=lat,
        longitude=lng,
        region="Local Farm", 
        status=models.BatchStatus.HARVESTED
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)

    # 3. Handle Image 
    file_ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_image = models.BatchImage(
        batch_id=db_batch.id,
        image_url=f"/static/uploads/{unique_filename}",
        description="Initial Harvest Photo"
    )
    db.add(new_image)
    
    # 4. Add Timeline Event
    db.add(models.BatchEvent(
        batch_id=db_batch.id,
        event_type="HARVEST",
        description=f"Farmer uploaded {quantity}kg of {crop_name}",
        location=f"{lat},{lng}"
    ))

    db.commit()
    db.refresh(db_batch)
    return db_batch

@router.get("/farmer/{farmer_id}", response_model=List[schemas.Batch])
def get_my_batches(farmer_id: int, db: Session = Depends(get_db)):
    return db.query(models.Batch).filter(models.Batch.farmer_id == farmer_id).order_by(models.Batch.harvest_date.desc()).all()

@router.get("/{batch_id}", response_model=schemas.Batch)
def get_batch_by_id(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch