# backend/routes/batches.py
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import datetime
import uuid

from database import get_db
import models
import schemas

router = APIRouter(prefix="/batches", tags=["Batches"])

# Helper to save images
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/all", response_model=List[schemas.Batch])
def get_all_batches(db: Session = Depends(get_db)):
    """Fetch all batches for the public feed/regulator map"""
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
    # 1. Handle File Upload
    file_ext =file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Parse Location (Simple CSV parse)
    lat, lng = 0.0, 0.0
    try:
        parts = location.split(",")
        lat = float(parts[0]) if len(parts) > 0 else 0.0
        lng = float(parts[1]) if len(parts) > 1 else 0.0
    except:
        pass 

    # 3. Create Batch Entry
    new_batch_id = str(uuid.uuid4())[:8]
    
    db_batch = models.Batch(
        batch_id=new_batch_id,
        farmer_id=farmer_id,
        crop_name=crop_name,
        quantity=quantity,
        latitude=lat,
        longitude=lng,
        region="North-Zone-1",
        status=models.BatchStatus.HARVESTED,
        
        video_story_url =f"/static/uploads/{unique_filename}",
        is_verified_on_chain = False,
    )
    
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@router.get("/farmer/{farmer_id}", response_model=List[schemas.Batch])
def get_my_batches(farmer_id: int, db: Session = Depends(get_db)):
    batches = db.query(models.Batch).filter(models.Batch.farmer_id == farmer_id).order_by(models.Batch.harvest_date.desc()).all()
    return batches

@router.get("/{batch_id}", response_model=schemas.Batch)
def get_batch_by_id(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch