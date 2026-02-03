# # backend/routes/consumer.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import get_db
# import models

# router = APIRouter(prefix="/consumer", tags=["Consumer"])

# @router.get("/story/{batch_id}")
# def get_food_journey_story(batch_id: str, db: Session = Depends(get_db)):
#     """
#     Constructs a 'Narrative' for the consumer UI.
#     Fetches Farmer Info, Lab Info, and Timeline.
#     """
#     batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()
#     if not batch:
#         raise HTTPException(status_code=404, detail="Product not found")

#     farmer_name = batch.owner.full_name if batch.owner else "a local farmer"
#     location = batch.owner.location if (batch.owner and batch.owner.location) else "North India"
#     date_str = batch.harvest_date.strftime("%B %d, %Y")
    
#     # 1. Build the Story Narrative
#     story_text = (
#         f"Meet your food! This {batch.crop_name} started its journey in the fields of {location}. "
#         f"It was carefully harvested by {farmer_name} on {date_str}. "
#     )
    
#     if batch.status == models.BatchStatus.LAB_TESTED:
#         story_text += "It has passed rigorous quality checks at the TraceRoots certified lab. "
    
#     story_text += "It is now pesticide-free and ready for your kitchen."

#     # 2. Build the Timeline Events
#     timeline = [
#         {"date": date_str, "event": "Harvested", "icon": "leaf", "desc": f"Harvested by {farmer_name}"}
#     ]

#     if batch.lab_report:
#         test_date = batch.lab_report.test_date.strftime("%B %d")
#         timeline.append({
#             "date": test_date, 
#             "event": "Lab Certified", 
#             "icon": "flask", 
#             "desc": batch.lab_report.result_summary
#         })

#     timeline.append({"date": "Today", "event": "In Store", "icon": "cart", "desc": "Ready for purchase"})

#     return {
#         "batch_details": {
#             "crop_name": batch.crop_name,
#             "quantity": batch.quantity,
#             "farmer_name": farmer_name,
#             "image": batch.video_story_url
#         },
#         "story_narrative": story_text,
#         "timeline": timeline,
#         "verification": {
#             "is_verified": batch.is_verified_on_chain,
#             "blockchain_hash": batch.blockchain_tx_hash or "Pending Verification"
#         }
#     }
from utils.tts_utils import generate_voiceover
from utils.video_utils import generate_video
from fastapi import Depends, HTTPException, APIRouter
from database import get_db
from sqlalchemy.orm import Session
import models

router = APIRouter(prefix="/consumer", tags=["Consumer"])

@router.get("/consumer/video/{batch_id}")
def get_or_generate_video(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(models.Batch).filter(models.Batch.batch_id == batch_id).first()

    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    # CACHE CHECK (VERY IMPORTANT)
    if batch.video_story_url:
        return {"video_url": batch.video_story_url}

    story_text = (
        f"Meet your food. "
        f"This {batch.crop_name} was harvested on {batch.harvest_date.date()} "
        f"by a verified farmer in {batch.region or 'India'}. "
        f"It received an AI quality score of {int(batch.ai_quality_score or 85)} percent "
        f"and is secured on blockchain."
    )

    audio_path = generate_voiceover(story_text, batch.batch_id)
    video_path = generate_video(batch, audio_path)

    video_url = f"http://localhost:8000/{video_path}"

    batch.video_story_url = video_url
    db.commit()

    return {"video_url": video_url}
