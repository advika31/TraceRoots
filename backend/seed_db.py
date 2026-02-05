# backend/seed_db.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from passlib.context import CryptContext
import models
import datetime
import random

db = SessionLocal()

print("Seeding TraceRoots Database...")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_pwd(pwd: str):
    return pwd_context.hash(pwd)
    
# Helpers
def create_user(username, role, name, loc):
    u = models.User(
        username=username,
        email=f"{username}@traceroots.com",
        hashed_password=hash_pwd("123"),
        full_name=name,
        location=loc,
        role=role
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

# Users
farmers = []
for i in range(5):
    farmers.append(create_user(f"farmer{i+1}", "COLLECTOR", f"Farmer {i+1}", f"Punjab-District-{i+1}"))

processor = create_user("processor1", "PROCESSOR", "Dr. A. Scientist", "Delhi Lab")
regulator = create_user("regulator1", "REGULATOR", "Govt. Officer", "New Delhi")
ngo = create_user("ngo1", "NGO", "Food Rescue India", "Mumbai")
consumer = create_user("consumer1", "CONSUMER", "Anita Sharma", "Bangalore")

print("Created 5 Farmers, 1 Processor, 1 Regulator, 1 NGO, 1 Consumer")

# Settings
db.add(models.GlobalSettings(key="MAX_HARVEST_LIMIT", value="500"))
db.add(models.GlobalSettings(key="BANNED_REGIONS", value="Banned Zone 1,Banned Zone 2"))
db.commit()
print("Created Global Settings")

# Batches
crops = ["Wheat", "Rice", "Tomato", "Potato", "Onion", "Saffron"]
statuses = ["HARVESTED", "AT_PROCESSOR", "LAB_TESTED", "SOLD", "DONATION_READY"]
stressed_regions = ["Stressed Zone 1", "Stressed Zone 2"]

for i in range(50):
    farmer = random.choice(farmers)
    crop = random.choice(crops)
    qty = random.randint(50, 800)

    lat = 30.73 + (random.random() * 0.1)
    lng = 76.77 + (random.random() * 0.1)
    region = farmer.location
    if i < 12:
        region = random.choice(stressed_regions)

    batch = models.Batch(
        batch_id=str(uuid.uuid4())[:8],
        farmer_id=farmer.id,
        crop_name=crop,
        quantity=qty,
        harvest_date=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 30)),
        expiry_date=datetime.datetime.utcnow() + datetime.timedelta(days=random.randint(-2, 5)),
        status=random.choice(statuses),
        latitude=lat,
        longitude=lng,
        region=region
    )
    db.add(batch)

    # Images (mock angles)
    for angle in range(2):
        db.add(models.BatchImage(
            batch=batch,
            image_url=f"/static/uploads/mock_{random.randint(1,5)}.jpg",
            description=f"Harvest Angle {angle + 1}"
        ))

    # Timeline event
    db.add(models.BatchEvent(
        batch=batch,
        event_type="HARVEST",
        description=f"Harvested {qty}kg of {crop}",
        location=region
    ))

db.commit()
print("Created 50+ Batches with Timeline Events")

# Notifications
db.add(models.Notification(
    user_id=regulator.id,
    type="ALERT",
    sender="System",
    priority="Urgent",
    message="High water usage detected in District-1"
))
db.add(models.Notification(
    user_id=regulator.id,
    type="INFO",
    sender="System",
    priority="Normal",
    message="5 New Farmers registered today"
))
db.add(models.Notification(
    user_id=ngo.id,
    type="ALERT",
    sender="System",
    priority="Important",
    message="Donation ready: Batch TR-101 (Tomato, 200kg)."
))

# Feedback sample
db.add(models.ConsumerFeedback(
    batch_id=1,
    farmer_id=farmers[0].id,
    rating=5,
    comment="Excellent quality wheat! Very fresh."
))

db.commit()
print("Database Seeded Successfully.")
db.close()
