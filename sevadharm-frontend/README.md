
### Step 1: Start the Database & API (Backend)
cd sevadharam-backend
venv\Scripts\activate
uvicorn main:app --reload --port 800
### Step 2: Start the User Interface (Frontend)
cd "sevadharam frontend"
npm run dev