# backend/schemas.py
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
from models import BatchStatus, UserRole

# --- Auth & User Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: UserRole = UserRole.COLLECTOR
    location: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str
    
class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    reputation_score: int
    impact_tokens: int

    class Config:
        from_attributes = True

# --- Timeline & Events ---
class BatchEventBase(BaseModel):
    event_type: str
    description: str
    location: Optional[str] = None

class BatchEventCreate(BatchEventBase):
    pass

class BatchEvent(BatchEventBase):
    id: int
    timestamp: datetime
    batch_id: int

    class Config:
        from_attributes = True

# --- Lab Reports ---
class LabReportBase(BaseModel):
    result_summary: str
    report_file_url: str

class LabReportCreate(LabReportBase):
    pass

class LabReport(LabReportBase):
    id: int
    test_date: datetime
    processor_id: int

    class Config:
        from_attributes = True

# --- Feedback ---
class FeedbackBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Batch (The Core Object) ---
class BatchBase(BaseModel):
    crop_name: str
    quantity: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    region: Optional[str] = None

class BatchCreate(BatchBase):
    pass

class BatchUpdate(BaseModel):
    status: Optional[BatchStatus] = None
    blockchain_tx_hash: Optional[str] = None
    is_verified_on_chain: Optional[bool] = None
    ai_quality_score: Optional[float] = None
    ai_freshness_grade: Optional[str] = None
    video_story_url: Optional[str] = None

class Batch(BatchBase):
    id: int
    batch_id: str
    farmer_id: int
    harvest_date: datetime
    status: BatchStatus
    
    blockchain_tx_hash: Optional[str] = None
    is_verified_on_chain: bool
    ai_quality_score: Optional[float] = None
    ai_freshness_grade: Optional[str] = None
    video_story_url: Optional[str] = None

    # Nested Relationships
    owner: Optional[User] = None
    timeline_events: List[BatchEvent] = []
    lab_report: Optional[LabReport] = None
    feedbacks: List[Feedback] = []

    class Config:
        from_attributes = True