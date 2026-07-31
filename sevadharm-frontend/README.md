
### Step 1: Start the Database & API (Backend)
cd "C:\Users\arkap\GitHub\seva-Dharm"
cd sevadharm-backend
.\venv\Scripts\Activate
python -m uvicorn main:app --reload --port 8000

### Step 2: Start the User Interface (Frontend)
cd "C:\Users\arkap\GitHub\seva-Dharm"
cd sevadharm-frontend
npm run dev