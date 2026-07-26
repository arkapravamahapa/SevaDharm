from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.schemas import DoctorCreate

router = APIRouter(
    prefix="/api/doctors",
    tags=["Doctors"]
)

@router.get("/")
async def get_doctors(specialty: str = None):
    try:
        query = supabase.table("doctors").select("*").eq("city", "Calcutta")
        if specialty:
            query = query.eq("specialty", specialty)
            
        response = query.execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def add_doctor(doctor: DoctorCreate):
    try:
        data_to_insert = doctor.model_dump()
        response = supabase.table("doctors").insert(data_to_insert).execute()
        return {"status": "success", "message": "Specialist added to the active network.", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))