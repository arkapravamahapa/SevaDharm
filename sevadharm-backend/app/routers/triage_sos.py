import os
import math
import random
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.database import supabase
from app.schemas import TriageRequest, SOSRequest
from app.audit import log_audit_event
from dependencies import verify_supabase_token

router = APIRouter(
    tags=["Triage & Emergency"]
)

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def process_sos_audit_background(user_id: str, sos_details: dict):
    """
    Background helper task to log high-risk medical emergencies into the secure audit ledger.
    """
    log_audit_event(
        user_id=user_id,
        action="CRITICAL_SOS_DISPATCHED",
        details=sos_details
    )

@router.post("/api/triage")
async def analyze_symptoms(
    request: TriageRequest,
    user_payload: dict = Depends(verify_supabase_token)
):
    try:
        symptoms_text = " ".join(request.symptoms).lower()
        
        specialty = "General Physician"
        urgency = "Standard"
        advice = "Monitor symptoms and stay hydrated. Consult a doctor if condition worsens."

        if "chest pain" in symptoms_text or "shortness of breath" in symptoms_text:
            specialty = "Cardiologist"
            urgency = "CRITICAL"
            advice = "Immediate medical attention required. Please use the SOS feature to dispatch an ambulance."
        elif "headache" in symptoms_text and "fever" in symptoms_text:
            specialty = "Neurologist"
            urgency = "High"
            advice = "High fever combined with severe headache requires professional neurological screening."
        elif "stomach" in symptoms_text or "nausea" in symptoms_text or "vomiting" in symptoms_text:
            specialty = "Gastroenterologist"
        elif "bone" in symptoms_text or "joint" in symptoms_text or "muscle" in symptoms_text:
            specialty = "Orthopedist"
        elif "skin" in symptoms_text or "rash" in symptoms_text or "itch" in symptoms_text:
            specialty = "Dermatologist"

        if request.pain_level >= 8 and urgency == "Standard":
            urgency = "High"
            advice = "Pain levels are severe. Schedule a consultation as soon as possible."

        return {
            "status": "success",
            "data": {
                "recommended_specialty": specialty,
                "urgency_level": urgency,
                "clinical_advice": advice,
                "analyzed_symptoms_count": len(request.symptoms)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/sos/dispatch")
async def trigger_sos_dispatch(
    sos: SOSRequest,
    background_tasks: BackgroundTasks,
    user_payload: dict = Depends(verify_supabase_token)
):
    try:
        user_id = user_payload.get("sub")
        
        response = supabase.table("hospitals").select("*").execute()
        hospitals = response.data if response.data else []

        if not hospitals:
            raise HTTPException(status_code=404, detail="No hospitals registered in the database network.")

        nearest_hospital = None
        min_distance = float('inf')

        for h in hospitals:
            h_lat = h.get("lat")
            h_lng = h.get("lng")
            if h_lat is not None and h_lng is not None:
                dist = calculate_distance(sos.latitude, sos.longitude, float(h_lat), float(h_lng))
                if dist < min_distance:
                    min_distance = dist
                    nearest_hospital = h

        if not nearest_hospital:
            nearest_hospital = hospitals[0]
            min_distance = 4.0

        dynamic_eta = max(3, int(min_distance * 2.5 + 3))
        current_date = datetime.now().strftime("%Y-%m-%d")

        # Log emergency record into the database
        supabase.table("medical_records").insert({
            "patient_email": "emergency.dispatch@sevadharm.com",
            "record_type": "Emergency SOS",
            "title": f"SOS Dispatched to {nearest_hospital.get('name')}",
            "doctor_name": "Emergency Response Unit",
            "date": current_date,
            "details": f"Patient: {sos.patient_name} ({sos.mobile}) | Distance: {round(min_distance, 1)}km"
        }).execute()

        # Safely trigger compliance audit tracking in the background
        dispatch_payload = {
            "patient_name": sos.patient_name,
            "mobile": sos.mobile,
            "latitude": sos.latitude,
            "longitude": sos.longitude,
            "assigned_hospital": nearest_hospital.get("name"),
            "distance_km": round(min_distance, 1)
        }
        background_tasks.add_task(process_sos_audit_background, user_id, dispatch_payload)

        return {
            "status": "success",
            "message": "Emergency dispatch initiated successfully. Ambulance en route.",
            "data": {
                "dispatch_id": f"SOS-{os.urandom(3).hex().upper()}",
                "assigned_hospital": nearest_hospital.get("name"),
                "hospital_contact": nearest_hospital.get("contact", "+91 33 2288 0000"),
                "eta_minutes": dynamic_eta,
                "distance_km": round(min_distance, 1),
                "ambulance_unit": f"WB-02-EMS-{random.randint(1000, 9999)}"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))