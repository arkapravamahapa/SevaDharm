from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.schemas import HospitalCreate

# Define the router and the base URL path
router = APIRouter(
    prefix="/api/hospitals",
    tags=["Hospitals"]
)

@router.get("/")
async def get_hospitals():
    try:
        response = supabase.table("hospitals").select("*").eq("city", "Calcutta").execute()
        if response.data:
            return {"status": "success", "data": response.data}
        
        fallback_response = supabase.table("hospitals").select("*").execute()
        return {"status": "success", "data": fallback_response.data}
    except Exception as e:
        try:
            fallback_response = supabase.table("hospitals").select("*").execute()
            return {"status": "success", "data": fallback_response.data}
        except Exception as inner_e:
            raise HTTPException(status_code=500, detail=str(inner_e))

@router.post("/")
async def add_hospital(hospital: HospitalCreate):
    try:
        data_to_insert = hospital.model_dump()
        response = supabase.table("hospitals").insert(data_to_insert).execute()
        return {"status": "success", "message": "Hospital added successfully!", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{hospital_id}")
async def delete_hospital(hospital_id: str):
    try:
        supabase.table("hospitals").delete().eq("id", hospital_id).execute()
        return {"status": "success", "message": "Hospital removed from network."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))