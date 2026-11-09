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
MAINTENANCE_MODE = os.getenv("MAINTENANCE_MODE", "false").lower() == "true"

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
# ==========================================
@app.middleware("http")
async def check_maintenance_mode(request: Request, call_next):
    bypassed_paths = (
        "/api/health",
        "/static",
        "/api/patient/dashboard",
        "/api/mobile",
    )
    if MAINTENANCE_MODE and not request.url.path.startswith(bypassed_paths):
        return JSONResponse(
            status_code=503,
            content={"detail": "System is under scheduled maintenance. Please check back later."},
        )
    return await call_next(request)

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
    allow_origin_regex=r"https://.*\.vercel\.app", 
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
# --- MOBILE APP DASHBOARD (REAL DATABASE) ---
# ==========================================
@app.get("/api/patient/dashboard")
@limiter.limit("40/minute")
async def get_patient_dashboard(request: Request, patient_id: str = None):
    """
    Fetches real patient dashboard data from Supabase for the Flutter frontend.
    Pass ?patient_id=uuid in the URL to fetch a specific patient, otherwise fetches the latest global metrics.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        # 1. Fetch Next Appointment from Supabase
        appt_query = supabase.table("appointments").select("*, doctors(name)").eq("status", "scheduled")
        if patient_id:
            appt_query = appt_query.eq("patient_id", patient_id)
        
        appt_res = appt_query.order("appointment_date", desc=False).limit(1).execute()
        
        next_appt = {"date": "No upcoming", "doctor": "Book now"}
        if appt_res.data:
            record = appt_res.data[0]
            # Assumes relationship between appointments and doctors table
            doc_name = record.get("doctors", {}).get("name", "Unknown Doctor") if record.get("doctors") else "Unknown Doctor"
            # Format datetime safely
            date_str = record.get("appointment_date", "N/A")
            next_appt = {"date": date_str, "doctor": doc_name}

        # 2. Fetch Vitals from Supabase
        vitals_query = supabase.table("patient_vitals").select("*")
        if patient_id:
            vitals_query = vitals_query.eq("patient_id", patient_id)
            
        vitals_res = vitals_query.order("created_at", desc=True).limit(1).execute()
        
        vitals_data = {"bmi": "N/A", "status": "Needs Update"}
        if vitals_res.data:
            v = vitals_res.data[0]
            vitals_data = {"bmi": str(v.get("bmi", "N/A")), "status": v.get("status", "Recorded")}

        # 3. Fetch Latest Report from Supabase
        reports_query = supabase.table("lab_reports").select("*")
        if patient_id:
            reports_query = reports_query.eq("patient_id", patient_id)
            
        reports_res = reports_query.order("created_at", desc=True).limit(1).execute()
        
        latest_report = {"title": "No Reports", "date": "N/A", "status": "Unknown"}
        if reports_res.data:
            r = reports_res.data[0]
            latest_report = {"title": r.get("title", "Report"), "date": r.get("report_date", "N/A"), "status": r.get("status", "Pending")}

        return {
            "nextAppointment": next_appt,
            "vitals": vitals_data,
            "latestReport": latest_report,
            "healthScore": {"label": "Active", "value": 85} # Can be calculated based on vitals mapping
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch live dashboard: {str(e)}")

# ==========================================
# --- MOBILE APP NOTIFICATIONS (REAL DB) ---
# ==========================================
@app.get("/api/patient/notifications")
@limiter.limit("40/minute")
async def get_patient_notifications(request: Request, patient_id: str = None):
    """
    Fetches real patient notifications directly from the Supabase notifications table.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        # Pulls real rows from your database instead of hardcoded strings
        query = supabase.table("notifications").select("*").order("created_at", desc=True).limit(5)
        
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        notifs_res = query.execute()
        
        # Returns the actual database rows to Flutter
        return notifs_res.data if notifs_res.data else []

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")

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
        "patient_token": patient_token,
        "session_details": db_response.data[0] if db_response.data else None
    }

# ==========================================
# --- SENTRY DEBUG / TESTING ROUTE ---
# ==========================================
@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0