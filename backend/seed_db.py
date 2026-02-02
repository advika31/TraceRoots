# backend/seed_db.py
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import datetime
import random
import uuid

# 1. Reset DB
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

print("🌱 Seeding TraceRoots Database...")

# --- HELPERS ---
def create_user(username, role, name, loc):
    u = models.User(
        username=username,
        email=f"{username}@traceroots.com",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", 
        full_name=name,
        location=loc,
        role=role
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

# --- 2. CREATE USERS ---
farmers = []
for i in range(5):
    farmers.append(create_user(f"farmer{i+1}", "COLLECTOR", f"Farmer {i+1}", f"Punjab-District-{i+1}"))

processor = create_user("processor1", "PROCESSOR", "Dr. A. Scientist", "Delhi Lab")
regulator = create_user("regulator1", "REGULATOR", "Govt. Officer", "New Delhi")
ngo = create_user("ngo1", "NGO", "Food Rescue India", "Mumbai")
consumer = create_user("consumer1", "CONSUMER", "Anita Sharma", "Bangalore")

print("✅ Created 5 Farmers, 1 Processor, 1 Regulator, 1 NGO, 1 Consumer")

# --- 3. CREATE STRESSED ZONES & SETTINGS ---
db.add(models.GlobalSettings(key="MAX_HARVEST_LIMIT", value="500"))
db.commit()
print("✅ Created Global Settings")

# --- 4. CREATE BATCHES (50+) ---
crops = ["Wheat", "Rice", "Tomato", "Potato", "Onion"]
statuses = ["HARVESTED", "AT_PROCESSOR", "LAB_TESTED", "SOLD", "DONATION_READY"]

for i in range(50):
    farmer = random.choice(farmers)
    crop = random.choice(crops)
    qty = random.randint(50, 800)
    
    lat = 30.73 + (random.random() * 0.1)
    lng = 76.77 + (random.random() * 0.1)

    batch = models.Batch(
        batch_id=str(uuid.uuid4())[:8],
        farmer_id=farmer.id,
        crop_name=crop,
        quantity=qty,
        harvest_date=datetime.datetime.utcnow() - datetime.timedelta(days=random.randint(0, 30)),
        status=random.choice(statuses),
        latitude=lat,
        longitude=lng,
        region=farmer.location,
        quality_grade=random.choice(["A", "B", "C"]) if random.random() > 0.5 else None
    )
    db.add(batch)

    # Add Image (Mock)
    db.add(models.BatchImage(
        batch=batch, 
        image_url=f"/static/uploads/mock_{random.randint(1,5)}.jpg",
        description="Harvest Front View"
    ))

    # Add Event
    db.add(models.BatchEvent(
        batch=batch,
        event_type="HARVEST",
        description=f"Harvested {qty}kg of {crop}",
        location=farmer.location
    ))

db.commit()
print("✅ Created 50+ Batches with Timeline Events")

# --- 5. CREATE ALERTS (Regulator) ---
db.add(models.Notification(
    user_id=regulator.id,
    type="ALERT",
    message="⚠️ High water usage detected in District-1"
))
db.add(models.Notification(
    user_id=regulator.id,
    type="INFO",
    message="ℹ️ 5 New Farmers registered today"
))

# --- 6. CREATE FEEDBACK (Reputation) ---
db.add(models.ConsumerFeedback(
    batch_id=1, 
    farmer_id=farmers[0].id,
    rating=5,
    comment="Excellent quality wheat! Very fresh."
))

db.commit()
print("✅ Database Seeded Successfully! 🚀")
db.close()
