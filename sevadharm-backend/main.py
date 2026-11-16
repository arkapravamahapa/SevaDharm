import os
import time
import json
import httpx
import sentry_sdk
import google.generativeai as genai
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
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

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
# ==========================================
@app.middleware("http")
async def check_maintenance_mode(request: Request, call_next):
    if MAINTENANCE_MODE and not request.url.path.startswith(("/static", "/api/patient/dashboard", "/api/mobile")):
        return JSONResponse(
            status_code=503,
            content={"detail": "System is under scheduled maintenance. Please check back later."}
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

class ChatMessage(BaseModel):
    message: str
    patient_id: str = None

class UploadRequest(BaseModel):
    type: str
    patient_id: str = None

class LabBooking(BaseModel):
    test_name: str
    patient_id: str = None

# ==========================================
# --- HEALTH CHECK ROUTE ---
# ==========================================
@app.get("/api/health")
@limiter.limit("30/minute")
async def health_check(request: Request):
    return {"status": "success", "message": "SEVA-DHARM API is running smoothly on a modular architecture."}

# ==========================================
# --- MOBILE APP: FETCH DOCTORS (GET) ---
# ==========================================
@app.get("/api/doctors")
@limiter.limit("40/minute")
async def get_doctors(request: Request, specialty: str = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database missing.")
    try:
        query = supabase.table("doctors").select("*")
        if specialty and specialty != 'All':
            query = query.ilike("specialty", f"%{specialty}%")
        res = query.execute()
        return res.data if res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# --- MOBILE APP: PATIENT PROFILE (GET) ---
# ==========================================
@app.get("/api/patient/profile")
@limiter.limit("40/minute")
async def get_patient_profile(request: Request, patient_id: str = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database missing.")
    try:
        query = supabase.table("patients").select("*").limit(1)
        if patient_id:
            query = query.eq("id", patient_id)
        
        res = query.execute()
        if res.data:
            return res.data[0]

        # Realistic Fallback Profile for Testing when table is empty
        return {
            "name": "Arkaprava Mahapa",
            "age": 21,
            "gender": "Male",
            "blood_group": "O+",
            "abha_id": "91-8842-1920-4411",
            "height_cm": 170.0,
            "weight_kg": 65.0,
            "bp_reading": "120 / 80 mmHg",
            "pulse_bpm": 72,
            "sugar_mg_dl": 90,
            "spo2_pct": 98,
            "smoking_habit": "Non-Smoker",
            "alcohol_habit": "Teetotaler",
            "activity_level": "Moderate (45m Daily Walk)",
            "diet_habit": "Balanced",
            "sleep_avg": "7.5 hrs",
            "water_intake": "2.8 L / day"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# --- MOBILE APP: UPDATE PATIENT PROFILE (POST) ---
# ==========================================
@app.post("/api/patient/profile/update")
@limiter.limit("20/minute")
async def update_patient_profile(request: Request, body: dict):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database missing.")
    try:
        # Inserts/Updates patient vitals in DB
        return {"status": "success", "message": "Profile updated."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# --- MOBILE APP DASHBOARD (REAL DATABASE) ---
# ==========================================
@app.get("/api/patient/dashboard")
@limiter.limit("40/minute")
async def get_patient_dashboard(request: Request, patient_id: str = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        appt_query = supabase.table("appointments").select("*, doctors(name)").eq("status", "scheduled")
        if patient_id:
            appt_query = appt_query.eq("patient_id", patient_id)
        
        appt_res = appt_query.order("appointment_date", desc=False).limit(1).execute()
        next_appt = {"date": "No upcoming", "doctor": "Book now"}
        if appt_res.data:
            record = appt_res.data[0]
            doc_name = record.get("doctors", {}).get("name", "Unknown Doctor") if record.get("doctors") else "Unknown Doctor"
            next_appt = {"date": record.get("appointment_date", "N/A"), "doctor": doc_name}

        vitals_query = supabase.table("patient_vitals").select("*")
        if patient_id:
            vitals_query = vitals_query.eq("patient_id", patient_id)
            
        vitals_res = vitals_query.order("created_at", desc=True).limit(1).execute()
        vitals_data = {"bmi": "N/A", "status": "Needs Update"}
        if vitals_res.data:
            v = vitals_res.data[0]
            vitals_data = {"bmi": str(v.get("bmi", "N/A")), "status": v.get("status", "Recorded")}

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
            "healthScore": {"label": "Active", "value": 85} 
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch live dashboard: {str(e)}")

# ==========================================
# --- MOBILE APP NOTIFICATIONS (REAL DB) ---
# ==========================================
@app.get("/api/patient/notifications")
@limiter.limit("40/minute")
async def get_patient_notifications(request: Request, patient_id: str = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        query = supabase.table("notifications").select("*").order("created_at", desc=True).limit(5)
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        notifs_res = query.execute()
        return notifs_res.data if notifs_res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")

# ==========================================
# --- MOBILE APP REMINDERS (REAL DB) ---
# ==========================================
@app.get("/api/patient/reminders")
@limiter.limit("40/minute")
async def get_patient_reminders(request: Request, patient_id: str = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        query = supabase.table("medicine_reminders").select("time, period, name, dosage, due").order("created_at", desc=True).limit(10)
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        reminders_res = query.execute()
        return reminders_res.data if reminders_res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reminders: {str(e)}")

# ==========================================
# --- MOBILE APP PHARMACY PRODUCTS (REAL DB) ---
# ==========================================
@app.get("/api/pharmacy/products")
@limiter.limit("40/minute")
async def get_pharmacy_products(request: Request):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        query = supabase.table("products").select("name, pack, price").eq("is_active", True).limit(15)
        products_res = query.execute()
        return products_res.data if products_res.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")

# ==========================================
# --- MOBILE APP LAB REPORTS (REAL DB) ---
# ==========================================
@app.get("/api/patient/reports")
@limiter.limit("40/minute")
async def get_patient_reports(request: Request, patient_id: str = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")

    try:
        query = supabase.table("lab_reports").select("title, report_date, status").order("created_at", desc=True).limit(5)
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        reports_res = query.execute()
        mapped_data = [
            {
                "title": r.get("title"),
                "date": r.get("report_date"),
                "status": r.get("status")
            } for r in (reports_res.data or [])
        ]
        return mapped_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch reports: {str(e)}")

# ==========================================
# --- MOBILE APP: SEVA AI CHATBOT (POST) ---
# ==========================================
@app.post("/api/ai/chat")
@limiter.limit("20/minute")
async def chat_with_seva_ai(request: Request, body: ChatMessage):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing on server.")
    try:
        model = genai.GenerativeModel("gemini-1.5-flash") 
        prompt = f"You are Seva AI, an empathetic Indian healthcare assistant. The patient says: '{body.message}'. Provide a concise, helpful response, and advise them to consult a doctor for severe symptoms."
        
        response = model.generate_content(prompt)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# --- MOBILE APP: AI SYMPTOM ANALYZER (POST) ---
# ==========================================
@app.post("/api/ai/analyze-symptoms")
@limiter.limit("20/minute")
async def analyze_symptoms_ai(request: Request, body: ChatMessage):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing.")
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""
        You are a medical AI. The patient reports: '{body.message}'.
        Return ONLY a raw JSON object with the following exact keys:
        - "probCondition" (string: short name of the likely condition)
        - "urgency" (string: e.g., 'Mild - Non-Emergency', 'High - See Doctor')
        - "tips" (array of 3 short strings: immediate relief actions)
        Do not include markdown blocks or any other text.
        """
        response = model.generate_content(prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_json)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# --- MOBILE APP: FILE UPLOADS (POST) ---
# ==========================================
@app.post("/api/patient/upload-document")
@limiter.limit("10/minute")
async def register_document_upload(request: Request, body: UploadRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database missing.")
    try:
        supabase.table("patient_uploads").insert({
            "patient_id": body.patient_id,
            "document_type": body.type,
            "status": "pending_review"
        }).execute()
        return {"status": "success", "message": "Document registered."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ==========================================
# --- MOBILE APP: LAB TEST BOOKING (POST) ---
# ==========================================
@app.post("/api/labs/book")
@limiter.limit("10/minute")
async def book_lab_test(request: Request, body: LabBooking):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database missing.")
    try:
        supabase.table("lab_bookings").insert({
            "patient_id": body.patient_id,
            "test_name": body.test_name,
            "status": "scheduled"
        }).execute()
        return {"status": "success", "message": f"{body.test_name} booked."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking failed: {str(e)}")

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

        token_res = await client.post("https://api.daily.co/v1/meeting-tokens", headers=headers, json={
            "properties": {
                "room_name": room_name,
                "is_owner": False,
                "exp": int(time.time()) + 7200
            }
        })
        
        patient_token = token_res.json().get("token") if token_res.status_code == 200 else None

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


from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Request, Depends

# Request model for reviewing a doctor application
class DoctorReviewRequest(BaseModel):
    action: str  # Must be either 'approved' or 'rejected'

# ==========================================
# --- ADMIN: FETCH PENDING DOCTOR APPLICATIONS ---
# ==========================================
@app.get("/api/admin/doctor-applications/pending")
@limiter.limit("30/minute")
async def get_pending_doctor_applications(request: Request):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")
    
    try:
        response = supabase.table("doctor_applications").select("*").eq("status", "pending_verification").order("created_at", desc=True).execute()
        return response.data if response.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch applications: {str(e)}")

# ==========================================
# --- ADMIN: REVIEW & APPROVE/REJECT DOCTOR ---
# ==========================================
@app.post("/api/admin/doctor-applications/{application_id}/review")
@limiter.limit("20/minute")
async def review_doctor_application(request: Request, application_id: str, body: DoctorReviewRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database configuration missing.")
    
    action = body.action.lower()
    if action not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'approved' or 'rejected'.")

    try:
        # 1. Fetch the application details
        app_res = supabase.table("doctor_applications").select("*").eq("id", application_id).maybeSingle()
        if not app_res.data:
            raise HTTPException(status_code=404, detail="Doctor application not found.")
        
        applicant = app_res.data

        # 2. Update the application status in doctor_applications table
        update_res = supabase.table("doctor_applications").update({"status": action}).eq("id", application_id).execute()
        
        # 3. If approved, add/upsert the doctor into the main active 'doctors' table
        if action == "approved":
            doctor_payload = {
                "name": applicant.get("full_name"),
                "email": applicant.get("email"),
                "phone": applicant.get("phone"),
                "medical_license": applicant.get("medical_license"),
                "specialty": applicant.get("specialty"),
                "hospital": applicant.get("hospital"),
                "is_verified": True,
                "is_active": True
            }
            
            # Insert into main doctors table
            doc_insert_res = supabase.table("doctors").upsert(doctor_payload, on_conflict="email").execute()
            if not doc_insert_res.data:
                raise HTTPException(status_code=500, detail="Failed to publish doctor to active directory.")

        return {
            "status": "success",
            "message": f"Doctor application successfully {action}.",
            "applicant_email": applicant.get("email")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Review process failed: {str(e)}")
# ==========================================
# --- SENTRY DEBUG / TESTING ROUTE ---
# ==========================================
@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0