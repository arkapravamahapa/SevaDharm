import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from dotenv import load_dotenv

load_dotenv()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
security = HTTPBearer()

def verify_supabase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifies the JWT token sent by the React frontend.
    Ensures only logged-in Supabase users can access the endpoint.
    """
    token = credentials.credentials
    
    if not SUPABASE_JWT_SECRET:
        raise HTTPException(status_code=500, detail="Server configuration error: Missing JWT Secret.")
        
    try:
        # Supabase signs tokens using HS256. The audience is typically 'authenticated'.
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"], 
            audience="authenticated"
        )
        return payload # Contains the user's UUID and email
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")