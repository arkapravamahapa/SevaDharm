import io
import os
import json
from datetime import datetime
from PIL import Image, UnidentifiedImageError
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.database import supabase
from app.schemas import MedicalRecordCreate, PrescriptionParseRequest
import google.generativeai as genai

# Initialize Gemini AI for Vision processing safely
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

router = APIRouter(
    tags=["Medical Records & Prescriptions"]
)

@router.get("/api/passport/records")
async def get_medical_records(email: str): 
    try:
        response = supabase.table("medical_records").select("*").eq("patient_email", email).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/passport/records")
async def add_medical_record(record: MedicalRecordCreate):
    try:
        data_to_insert = record.model_dump()
        response = supabase.table("medical_records").insert(data_to_insert).execute()
        return {"status": "success", "message": "Record added to medical passport.", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/api/prescription/parse")
async def parse_prescription(payload: PrescriptionParseRequest):
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        supabase.table("medical_records").insert({
            "patient_email": payload.patient_email,
            "record_type": "Text Prescription",
            "title": "Manual Text Entry",
            "doctor_name": "Self Logged",
            "date": current_date,
            "details": payload.raw_text
        }).execute()

        return {
            "status": "success",
            "message": "Prescription text successfully saved.",
            "data": {"raw_text": payload.raw_text}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/prescription/parse-ocr")
async def parse_prescription_ocr(
    patient_email: str = Form(...),
    file: UploadFile = File(...)
):
    if not gemini_api_key:
        raise HTTPException(
            status_code=500, 
            detail="GEMINI_API_KEY is missing from the backend environment variables (.env)."
        )

    # 1. FILE TYPE VALIDATION
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type '{file.content_type}'. Only JPEG, PNG, and WEBP images are allowed."
        )

    # 2. FILE SIZE VALIDATION (Limit to 5MB)
    max_file_size = 5 * 1024 * 1024 
    if file.size and file.size > max_file_size:
        raise HTTPException(status_code=400, detail="File is too large. Maximum allowed size is 5MB.")

    try:
        contents = await file.read()
        
        if len(contents) > max_file_size:
            raise HTTPException(status_code=400, detail="File is too large. Maximum allowed size is 5MB.")

        # 3. IMAGE INTEGRITY VALIDATION
        try:
            image = Image.open(io.BytesIO(contents))
            image.verify()
            image = Image.open(io.BytesIO(contents)) 
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="The uploaded file is corrupted or not a valid image format.")
        
        # 4. AI VISION ANALYSIS USING GEMINI
        try:
            vision_model = genai.GenerativeModel('gemini-3.1-flash-lite')
            
            prompt = """
            You are an expert clinical pharmacist in India, highly skilled at reading difficult doctor handwriting.
            Analyze this prescription image and extract the prescribed medications.
            Return ONLY a valid JSON array of objects. Do not include markdown tags like ```json.
            Each object must have these exact keys:
            - "name": The name of the medicine (and strength if visible).
            - "dosage": How often to take it (e.g., '1-0-1', 'Twice daily').
            - "duration": How long to take it (e.g., '5 days').
            If you cannot read any medications confidently, return an empty array: []
            """
            
            response = vision_model.generate_content([prompt, image])
            response_text = response.text.strip()
            
        except Exception as ai_err:
            print(f"Gemini API Error: {str(ai_err)}")
            raise HTTPException(status_code=500, detail=f"AI Vision Engine error: {str(ai_err)}")
        
        # Clean up response formatting
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()

        try:
            extracted_meds = json.loads(response_text)
        except json.JSONDecodeError:
            extracted_meds = [{"name": "Could not parse structured JSON", "dosage": response_text[:50], "duration": "N/A"}]

        parsed_data = []
        for i, med in enumerate(extracted_meds):
            formatted_text = f"{med.get('name', 'Unknown')} | Dose: {med.get('dosage', 'N/A')} | For: {med.get('duration', 'N/A')}"
            parsed_data.append({
                "id": f"MED-{i}",
                "raw_text": formatted_text,
            })

        # Save to database
        current_date = datetime.now().strftime("%Y-%m-%d")
        supabase.table("medical_records").insert({
            "patient_email": patient_email,
            "record_type": "AI Prescription Scan",
            "title": f"AI Scanned: {file.filename}",
            "doctor_name": "Seva AI Vision Engine",
            "date": current_date,
            "details": f"Extracted {len(extracted_meds)} medications accurately."
        }).execute()

        return {
            "status": "success",
            "message": "Prescription successfully analyzed by AI.",
            "data": parsed_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"General Server Error in OCR route: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")