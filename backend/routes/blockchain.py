from fastapi import APIRouter, HTTPException

from utils.blockchain_utils import verify_batch_onchain


router = APIRouter(prefix="/blockchain", tags=["blockchain"])


@router.get("/batch/{batch_id}")
def verify_batch(batch_id: int, crop_type: str):
    try:
        exists = verify_batch_onchain(batch_id, crop_type)
        return {"batch_id": batch_id, "crop_type": crop_type, "on_chain": exists}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



