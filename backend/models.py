#   backend/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    farm_size = Column(Float, nullable=False)
    wallet_address = Column(String, nullable=False)
    tokens = Column(Integer, default=0)

    batches = relationship("FoodBatch", back_populates="farmer")


class FoodBatch(Base):
    __tablename__ = "food_batches"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    crop_type = Column(String, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    nutrition_score = Column(Float, nullable=True)
    blockchain_tx = Column(String, nullable=True)
    qr_path = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending | distributed

    farmer = relationship("Farmer", back_populates="batches")
    surplus = relationship("Surplus", back_populates="batch", uselist=False)


class Surplus(Base):
    __tablename__ = "surpluses"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("food_batches.id"), nullable=False, unique=True)
    ngo_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    batch = relationship("FoodBatch", back_populates="surplus")



