
### Step 1: Start the Database & API (Backend)
cd sevadharm-backend
venv\Scripts\activate
uvicorn main:app --reload --port 800
### Step 2: Start the User Interface (Frontend)
cd "sevadharm frontend"
npm run dev