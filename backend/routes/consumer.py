from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import FoodBatch, Farmer
from schemas import TraceOut, AnalyticsSummary

router = APIRouter(prefix="/consumer", tags=["consumer"]) 


@router.get("/trace/{batch_id}", response_model=TraceOut)
def trace_batch(batch_id: int, request: Request, db: Session = Depends(get_db)):
    batch = db.get(FoodBatch, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    farmer = db.get(Farmer, batch.farmer_id)
    base_url = str(request.base_url).rstrip("/")
    qr_url = None
    if batch.qr_path:
        qr_url = f"{base_url}/static/qr/{batch.id}.png"
    return TraceOut(
        batch_id=batch.id,
        farmer_name=farmer.name if farmer else "Unknown",
        crop_type=batch.crop_type,
        quantity_kg=batch.quantity_kg,
        nutrition_score=batch.nutrition_score,
        blockchain_tx=batch.blockchain_tx,
        status=batch.status,
        qr_url=qr_url,
    )


@router.get("/analytics/summary", response_model=AnalyticsSummary)
def analytics_summary(db: Session = Depends(get_db)):
    total_farmers = db.query(Farmer).count()
    total_batches = db.query(FoodBatch).count()
    total_distributed = db.query(FoodBatch).filter(FoodBatch.status == "distributed").count()
    total_tokens = sum(f.tokens or 0 for f in db.query(Farmer).all())
    return AnalyticsSummary(
        total_farmers=total_farmers,
        total_batches=total_batches,
        total_distributed=total_distributed,
        total_tokens=total_tokens,
    )



