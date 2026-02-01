# backend/routes/processor.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import shutil
import uuid
import datetime
from database import get_db
import models
import schemas

router = APIRouter(prefix="/processor", tags=["Processor"])

UPLOAD_DIR = "static/reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/lab-report/{batch_id}")
def upload_lab_report(
    batch_id: str,
    result_summary: str = Form(...), 
    file: UploadFile = File(...),
    processor_id: int = Form(...),   
    db: Session = Depends(get_db)
):
    # 1. Verify Batch Exists
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # 2. Save Report File
    file_ext = file.filename.split(".")[-1]
    filename = f"report_{batch_id}_{uuid.uuid4().hex[:6]}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3. Create DB Entry
    existing_report = db.query(models.LabReport).filter(models.LabReport.batch_id == batch.id).first()
    
    if existing_report:
        existing_report.result_summary = result_summary
        existing_report.report_file_url = f"/static/reports/{filename}"
        existing_report.test_date = datetime.datetime.utcnow()
    else:
        new_report = models.LabReport(
            batch_id=batch.id,
            processor_id=processor_id,
            test_date=datetime.datetime.utcnow(),
            result_summary=result_summary,
            report_file_url=f"/static/reports/{filename}"
        )
        db.add(new_report)
    
    # 4. Update Batch Status
    batch.status = models.BatchStatus.LAB_TESTED
    batch.ai_quality_score = 95.0 # Mock
    
    db.commit()
    
    return {"message": "Lab report attached", "url": f"/static/reports/{filename}"}

@router.put("/status/{batch_id}")
def update_batch_status(
    batch_id: str, 
    status: models.BatchStatus,
    db: Session = Depends(get_db)
):
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    batch.status = status
    db.commit()
    return {"status": "Updated", "new_status": status}