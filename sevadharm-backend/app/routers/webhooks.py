import os
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, Header
from dotenv import load_dotenv
from app.database import supabase

load_dotenv()

router = APIRouter(prefix="/api/webhooks", tags=["Webhooks"])

RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

@router.post("/razorpay")
async def razorpay_webhook(
    request: Request, 
    x_razorpay_signature: str = Header(None)
):
    """
    Secure endpoint that Razorpay calls automatically when a payment succeeds.
    It verifies the cryptographic signature to guarantee the payment is real.
    """
    if not RAZORPAY_WEBHOOK_SECRET:
        raise HTTPException(status_code=500, detail="Razorpay webhook secret not configured.")
    
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing signature header.")

    # Get the raw body as bytes for signature verification
    payload = await request.body()
    
    # 1. Mathematically verify the signature to prevent fraud
    generated_signature = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(generated_signature, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Fraud Alert: Invalid payment signature.")

    # 2. Process the verified payment
    data = await request.json()
    
    # Check if the event is a successful capture of funds
    if data.get("event") == "payment.captured":
        payment_entity = data.get("payload", {}).get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        
        # 3. Update the Supabase database to mark the order as officially paid
        if supabase and order_id:
            try:
                supabase.table("appointments").update({
                    "payment_status": "paid"
                }).eq("payment_order_id", order_id).execute()
            except Exception as e:
                print(f"Database update failed for order {order_id}: {str(e)}")
                # We still return 200 so Razorpay knows we received the webhook
                return {"status": "received_but_db_failed"}
                
    return {"status": "success"}