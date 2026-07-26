import os
from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.schemas import DiagnosticBookingRequest

router = APIRouter(
    prefix="/api/labs",
    tags=["Diagnostic Labs"]
)

@router.get("/packages")
async def get_diagnostic_packages():
    try:
        # Strictly queries the real database. No fallback fake data.
        response = supabase.table("diagnostic_packages").select("*").execute()
        packages = response.data if response.data else []
        return {"status": "success", "data": packages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/book")
async def book_diagnostic_test(booking: DiagnosticBookingRequest):
    try:
        record = {
            "patient_email": booking.patient_email,
            "record_type": "Lab Booking",
            "title": f"Booked: {booking.package_name}",
            "doctor_name": "Home Phlebotomist",
            "date": booking.date,
            "details": f"Slot: {booking.slot} | Address: {booking.address}"
        }
        
        supabase.table("medical_records").insert(record).execute()
        
        return {
            "status": "success",
            "message": "Home sample collection scheduled successfully.",
            "data": {
                "booking_ref": f"LAB-{os.urandom(3).hex().upper()}",
                "package": booking.package_name,
                "scheduled_slot": f"{booking.date} at {booking.slot}",
                "phlebotomist_assigned": "Pending Assignment"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))