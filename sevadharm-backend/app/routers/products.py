from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.schemas import ProductCreate

router = APIRouter(
    prefix="/api/products",
    tags=["Pharmacy & Products"]
)

@router.get("/")
async def get_products():
    try:
        response = supabase.table("products").select("*").eq("city", "Calcutta").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def add_product(product: ProductCreate):
    try:
        data_to_insert = product.model_dump()
        response = supabase.table("products").insert(data_to_insert).execute()
        return {"status": "success", "message": "Product added to pharmacy registry.", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))