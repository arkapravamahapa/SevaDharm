import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables securely
load_dotenv()

# Initialize Supabase Client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise RuntimeError("Supabase credentials missing in .env file.")

supabase: Client = create_client(supabase_url, supabase_key)