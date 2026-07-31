import os
from datetime import datetime
from app.database import supabase

def log_audit_event(user_id: str, action: str, details: dict):
    """
    Tracks sensitive actions such as SOS dispatches and prescription parses
    to ensure medical compliance and system auditability.
    """
    if not supabase:
        return
    
    try:
        supabase.table("audit_logs").insert({
            "user_id": user_id,
            "action": action,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        }).execute()
    except Exception as e:
        print(f"Audit logging failed: {str(e)}")