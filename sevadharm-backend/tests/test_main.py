import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check_endpoint():
    """Verify that the system health check route responds properly."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_sentry_debug_route():
    """Verify that unhandled exceptions correctly trigger a ZeroDivisionError for Sentry testing."""
    with pytest.raises(ZeroDivisionError):
        client.get("/sentry-debug")

def test_unauthorized_consultation_creation():
    """Ensure that room creation fails without a valid Bearer token."""
    payload = {
        "appointment_id": "test_apt_123",
        "doctor_id": "doc_456",
        "patient_id": "pat_789"
    }
    response = client.post("/api/consultations/create-room", json=payload)
    assert response.status_code in [401, 403]