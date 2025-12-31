# backend/schemas.py
from pydantic import BaseModel
from typing import Optional


class FarmerCreate(BaseModel):
    name: str
    location: str
    farm_size: float
    wallet_address: str


class FarmerOut(BaseModel):
    id: int
    name: str
    location: str
    farm_size: float
    wallet_address: str
    tokens: int

    class Config:
        from_attributes = True


class FoodBatchCreate(BaseModel):
    farmer_id: int
    crop_type: str
    quantity_kg: float


class FoodBatchOut(BaseModel):
    id: int
    farmer_id: int
    crop_type: str
    quantity_kg: float
    nutrition_score: Optional[float] = None
    blockchain_tx: Optional[str] = None
    qr_path: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


class SurplusCreate(BaseModel):
    batch_id: int
    ngo_name: str


class SurplusOut(BaseModel):
    id: int
    batch_id: int
    ngo_name: str
    class Config:
        from_attributes = True


class TraceOut(BaseModel):
    batch_id: int
    farmer_name: str
    crop_type: str
    quantity_kg: float
    nutrition_score: Optional[float]
    blockchain_tx: Optional[str]
    status: str
    qr_url: Optional[str]


class TokenBalance(BaseModel):
    farmer_id: int
    tokens: int


class AnalyticsSummary(BaseModel):
    total_farmers: int
    total_batches: int
    total_distributed: int
    total_tokens: int

class FarmerLogin(BaseModel):
    wallet_address: str
