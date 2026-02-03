from fastapi import APIRouter, File, UploadFile
from PIL import Image
import io

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    content = await file.read()
    img = Image.open(io.BytesIO(content)).convert("L")
    pixels = list(img.getdata())
    mean = sum(pixels) / max(1, len(pixels))
    score = int(min(100, max(0, (mean / 255.0) * 100)))

    return {
        "quality_score": score,
        "label": "PASS" if score >= 70 else "CHECK",
        "defects": []
    }
