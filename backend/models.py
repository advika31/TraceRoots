#   backend/models.py
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class BatchStatus(str, enum.Enum):
    HARVESTED = "HARVESTED"
    AT_PROCESSOR = "AT_PROCESSOR"
    LAB_TESTED = "LAB_TESTED"
    IN_TRANSIT = "IN_TRANSIT"
    SOLD = "SOLD"
    DONATION_READY = "DONATION_READY"
    DISTRIBUTED = "DISTRIBUTED"

class UserRole(str, enum.Enum):
    COLLECTOR = "COLLECTOR"
    PROCESSOR = "PROCESSOR"
    REGULATOR = "REGULATOR"
    CONSUMER = "CONSUMER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.COLLECTOR)
    
    full_name = Column(String, nullable=True)
    location = Column(String, nullable=True)
    
    reputation_score = Column(Integer, default=100)
    impact_tokens = Column(Integer, default=0)

    batches = relationship("Batch", back_populates="owner")
    lab_reports = relationship("LabReport", back_populates="processor")

class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String, unique=True, index=True) 
    
    farmer_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="batches")

    crop_name = Column(String, index=True)
    quantity = Column(Float)
    harvest_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default=BatchStatus.HARVESTED)
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    region = Column(String, nullable=True) 

    blockchain_tx_hash = Column(String, nullable=True) 
    is_verified_on_chain = Column(Boolean, default=False)
    
    ai_quality_score = Column(Float, nullable=True) 
    ai_freshness_grade = Column(String, nullable=True) 
    
    video_story_url = Column(String, nullable=True)

    timeline_events = relationship("BatchEvent", back_populates="batch")
    lab_report = relationship("LabReport", back_populates="batch", uselist=False)
    feedbacks = relationship("ConsumerFeedback", back_populates="batch")

class BatchEvent(Base):
    __tablename__ = "batch_events"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    event_type = Column(String) 
    description = Column(String)
    location = Column(String, nullable=True)

    batch = relationship("Batch", back_populates="timeline_events")

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    processor_id = Column(Integer, ForeignKey("users.id"))
    
    test_date = Column(DateTime, default=datetime.datetime.utcnow)
    report_file_url = Column(String) 
    result_summary = Column(String)
    
    batch = relationship("Batch", back_populates="lab_report")
    processor = relationship("User", back_populates="lab_reports")

class ConsumerFeedback(Base):
    __tablename__ = "consumer_feedback"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    
    rating = Column(Integer) 
    comment = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    batch = relationship("Batch", back_populates="feedbacks")