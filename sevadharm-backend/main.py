from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import all your modular routers
from app.routers import hospitals, doctors, products, labs, records, triage_sos

# Load environment variables securely
load_dotenv()

# Initialize FastAPI for a production environment
app = FastAPI(
    title="SEVA-DHARM API",
    description="Production-Ready Modular Backend for the SEVA-DHARM Medical Platform",
    version="1.0.0"
)

# CORS configuration allowing all origins for local development to prevent fetch errors
# Before live release:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Replace with your real frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers in the main application
app.include_router(hospitals.router)
app.include_router(doctors.router)
app.include_router(products.router)
app.include_router(labs.router)
app.include_router(records.router)
app.include_router(triage_sos.router)

# ==========================================
# --- HEALTH CHECK ROUTE ---
# ==========================================

@app.get("/api/health")
async def health_check():
    return {"status": "success", "message": "SEVA-DHARM API is running smoothly on a modular architecture."}