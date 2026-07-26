from pydantic import BaseModel

class HospitalCreate(BaseModel):
    name: str
    address: str
    type: str
    distance: str
    emergencyBeds: int
    lat: float
    lng: float
    contact: str
    city: str = "Calcutta"

class TriageRequest(BaseModel):
    symptoms: list[str]
    duration_days: int
    pain_level: int  # 1 to 10

class DoctorCreate(BaseModel):
    name: str
    specialty: str
    experience_years: int
    qualifications: str
    availability: str
    consultation_fee: int
    hospital_affiliation: str
    city: str = "Calcutta"

class ProductCreate(BaseModel):
    name: str
    category: str
    price: int
    stock_status: str
    description: str
    city: str = "Calcutta"

class SOSRequest(BaseModel):
    patient_name: str
    mobile: str
    latitude: float
    longitude: float
    emergency_type: str = "General Cardiac/Trauma"

class MedicalRecordCreate(BaseModel):
    patient_email: str
    record_type: str  # e.g., "Prescription", "Lab Report", "Consultation Bill"
    title: str
    doctor_name: str
    date: str
    details: str

class PrescriptionParseRequest(BaseModel):
    patient_email: str
    raw_text: str

class DiagnosticBookingRequest(BaseModel):
    patient_email: str
    package_name: str
    date: str
    slot: str
    address: str