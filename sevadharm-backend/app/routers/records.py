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
    allowed_types = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type '{file.content_type}'. Only JPEG, PNG, WEBP, and PDF files are allowed."
        )

    # 2. FILE SIZE VALIDATION (Limit to 5MB)
    max_file_size = 5 * 1024 * 1024 
    if file.size and file.size > max_file_size:
        raise HTTPException(status_code=400, detail="File is too large. Maximum allowed size is 5MB.")

    try:
        contents = await file.read()
        
        if len(contents) > max_file_size:
            raise HTTPException(status_code=400, detail="File is too large. Maximum allowed size is 5MB.")

        # 3. IMAGE INTEGRITY VALIDATION (Skip verify for PDFs if you intend to handle them elsewhere, otherwise keep for images)
        if file.content_type != "application/pdf":
            try:
                image = Image.open(io.BytesIO(contents))
                image.verify()
                image = Image.open(io.BytesIO(contents)) 
            except UnidentifiedImageError:
                raise HTTPException(status_code=400, detail="The uploaded file is corrupted or not a valid image format.")
        else:
            # If handling PDF, you'll need pdf2image or similar. Assuming Gemini handles it or you have an image:
            image = {"mime_type": "application/pdf", "data": contents}
        
        # 4. AI VISION ANALYSIS USING GEMINI (Strict Medical Guardrails)
        try:
            vision_model = genai.GenerativeModel('gemini-3.1-flash-lite')
            
            prompt = """
            You are an expert clinical pharmacist and AI document classifier.
            
            STEP 1: Document Verification
            Determine if the uploaded image is an actual medical prescription. If it is a selfie, landmark, invoice, random text, or unrelated document, set "is_prescription" to false and provide a "reason_invalid". Do not attempt to parse medications from invalid documents.
            
            STEP 2: Metadata Extraction
            If it is a valid prescription, extract the Doctor Name, Patient Name, Age, Sex, Date, and Clinic/Hospital Details. If any are missing, return "Not Provided".
            
            STEP 3: Medication Extraction (STRICT GUARDRAILS)
            - Extract the medicine name and its strength (if clearly visible).
            - Extract the dosage instructions (e.g., "1-0-1", "5ml", "Twice a day", "After food") EXACTLY as written by the doctor. Do NOT guess, infer, or convert it to specific clock times (like "8:00 AM") unless explicitly written on the paper. If no dosage is written, output "Not specified".
            - CRITICAL: If a medicine name is smudged, ambiguous, or you are less than 95% confident, DO NOT GUESS. Output exactly: "Unclear/Requires Doctor Verification".
            
            Return ONLY a valid JSON object. Do not include markdown tags like ```json.
            
            Expected JSON format:
            {
              "is_prescription": boolean,
              "reason_invalid": "string (only if is_prescription is false)",
              "metadata": {
                "doctor_name": "string",
                "patient_name": "string",
                "age": "string",
                "sex": "string",
                "date": "string",
                "clinic_details": "string"
              },
              "medications": [
                {
                  "name": "string (Medicine name + strength, OR 'Unclear/Requires Doctor Verification')",
                  "dosage": "string (Exact dosage written, or 'Not specified')"
                }
              ]
            }
            """
            
            # If PDF, pass differently if using the API directly, but assuming image handling here.
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
            parsed_json = json.loads(response_text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI returned malformed data. Please try again.")

        # Save to database if it's a valid prescription
        if parsed_json.get("is_prescription"):
            current_date = datetime.now().strftime("%Y-%m-%d")
            doc_name = parsed_json.get("metadata", {}).get("doctor_name", "Unknown Doctor")
            
            supabase.table("medical_records").insert({
                "patient_email": patient_email,
                "record_type": "AI Prescription Scan",
                "title": f"Prescription from {doc_name}",
                "doctor_name": doc_name,
                "date": current_date,
                "details": f"Extracted {len(parsed_json.get('medications', []))} medications safely."
            }).execute()

        return {
            "status": "success",
            "message": "Prescription successfully analyzed by AI.",
            "data": parsed_json
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"General Server Error in OCR route: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")
