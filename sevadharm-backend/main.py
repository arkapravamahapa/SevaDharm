import os
import time
import httpx
import sentry_sdk
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# SlowAPI imports for rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Import all your modular routers
from app.routers import hospitals, doctors, products, labs, records, triage_sos, webhooks

# Import your security dependency
from dependencies import verify_supabase_token

# Load environment variables securely
load_dotenv()

# ==========================================
# --- SENTRY ERROR TRACKING INITIALIZATION ---
# ==========================================
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

# ==========================================
# --- SECURE CONFIGURATION ---
# ==========================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
DAILY_API_KEY = os.getenv("DAILY_API_KEY")

# Set to True to put backend under maintenance mode
MAINTENANCE_MODE = False

# Initialize Supabase Admin Client gracefully
if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

# ==========================================
# --- RATE LIMITER INITIALIZATION ---
# ==========================================
limiter = Limiter(key_func=get_remote_address)

# ==========================================
# --- APP INITIALIZATION ---
# ==========================================
app = FastAPI(
    title="SEVA-DHARM API",
    description="Production-Ready Modular Backend for the SEVA-DHARM Medical Platform",
    version="1.0.0"
)

# ==========================================
# --- MAINTENANCE MODE MIDDLEWARE ---
# ==================================
@app.middleware("http")
async def check_maintenance_mode(request: Request, call_next):
    if MAINTENANCE_MODE and not request.url.path.startswith("/static"):
        return JSONResponse(
            status_code=503,
            content={"detail": "System is under scheduled maintenance. Please check back later."}
        )
    return await call_next(request)
    return response

# Register rate limiter exception handler and middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ==========================================
# --- PRODUCTION CORS FIX ---
# ==========================================
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://sevadharam.com",
    "https://www.sevadharam.com",
    "https://seva-dharm.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app", # Safely allows all dynamic Vercel preview branches
    allow_credentials=True,
    allow_methods=["*"], # Use the wildcard to prevent strict method blocking
    allow_headers=["*"],
)

# Include routers in the main application
app.include_router(hospitals.router)
app.include_router(doctors.router)
app.include_router(products.router)
app.include_router(labs.router)
app.include_router(records.router)
app.include_router(triage_sos.router)
app.include_router(webhooks.router)

# ==========================================
# --- REQUEST MODELS ---
# ==========================================
class CheckoutConfirmation(BaseModel):
    appointment_id: str
    doctor_id: str
    patient_id: str

# ==========================================
# --- HEALTH CHECK ROUTE ---
# ==========================================
@app.get("/api/health")
@limiter.limit("30/minute")
async def health_check(request: Request):
    return {"status": "success", "message": "SEVA-DHARM API is running smoothly on a modular architecture."}

# ==========================================
# --- TELEMEDICINE / CONSULTATIONS ROUTE ---
# ==========================================
@app.post("/api/consultations/create-room")
@limiter.limit("5/minute")
async def create_video_consultation(
    request: Request,
    body: CheckoutConfirmation,
    user_payload: dict = Depends(verify_supabase_token)
):
    """
    Called after successful payment checkout.
    Generates a secure Daily.co room AND creates short-lived, role-restricted meeting tokens.
    """
    if not DAILY_API_KEY:
        raise HTTPException(status_code=500, detail="Daily.co API key not configured on the server.")
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase environment variables missing on the server.")

    if user_payload.get("sub") != body.patient_id:
        raise HTTPException(status_code=403, detail="Unauthorized: User ID mismatch.")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DAILY_API_KEY}"
    }

    async with httpx.AsyncClient() as client:
        # 1. Create a secure temporary room
        room_resp = await client.post("https://api.daily.co/v1/rooms", headers=headers, json={
            "properties": {
                "exp": int(time.time()) + 7200, 
                "enable_chat": True,
                "enable_screenshare": True,
                "start_audio_off": True,
                "start_video_off": True,
                "eject_at_room_exp": True
            }
        })
        
        if room_resp.status_code != 200:
            raise HTTPException(status_code=room_resp.status_code, detail=f"Video provider error: {room_resp.text}")
            
        room_name = room_resp.json().get("name")
        room_url = room_resp.json().get("url")

        # 2. Generate a secure Meeting Token for the Patient (expires in 2 hours)
        token_resp = await client.post("https://api.daily.co/v1/meeting-tokens", headers=headers, json={
            "properties": {
                "room_name": room_name,
                "is_owner": False,
                "exp": int(time.time()) + 7200
            }
        })
        
        patient_token = token_resp.json().get("token") if token_resp.status_code == 200 else None

    # 3. Store the room info and token in Supabase
    try:
        db_response = supabase.table("video_sessions").insert({
            "appointment_id": body.appointment_id,
            "doctor_id": body.doctor_id,
            "patient_id": body.patient_id,
            "meeting_url": room_url,
            "status": "scheduled"
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database logging failed: {str(e)}")

    return {
        "status": "success",
        "message": "Secure tokenized video room provisioned.",
        "room_url": room_url,
        "patient_token": patient_token, # Send this token to the frontend video component
        "session_details": db_response.data[0] if db_response.data else None
    }

# ==========================================
# --- SENTRY DEBUG / TESTING ROUTE ---
# ==========================================
@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0
