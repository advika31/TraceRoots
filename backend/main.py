# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from routes import farmers, batches 
# from routes import processor, regulator, consumer, blockchain # UNCOMMENT AS WE FIX THEM

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TraceRoots API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(farmers.router)
app.include_router(batches.router)

@app.get("/")
def home():
    return {"message": "TraceRoots Backend is Live 🚀"}