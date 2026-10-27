cd sevadharm-backend
venv\Scripts\activate
uvicorn main:app --reload

cd sevadharm-frontend
npm run dev
```
seva-Dharm
├─ Demo ui
│  ├─ 1.png
│  ├─ 2.png
│  ├─ 3.png
│  ├─ 4.png
│  ├─ home page.png
│  ├─ logo.jpeg
│  └─ sos.jpeg
├─ README.md
├─ sevadharm-backend
│  ├─ .dockerignore
│  ├─ app
│  │  ├─ audit.py
│  │  ├─ database.py
│  │  ├─ routers
│  │  │  ├─ doctors.py
│  │  │  ├─ hospitals.py
│  │  │  ├─ labs.py
│  │  │  ├─ products.py
│  │  │  ├─ records.py
│  │  │  ├─ triage_sos.py
│  │  │  ├─ webhooks.py
│  │  │  └─ __init__.py
│  │  ├─ schemas.py
│  │  └─ _init__.py
│  ├─ dependencies.py
│  ├─ Dockerfile
│  ├─ main.py
│  ├─ requirements.txt
│  └─ tests
│     └─ test_main.py
└─ sevadharm-frontend
   ├─ assets
   │  ├─ hero-doctor.png
   │  ├─ icons
   │  │  ├─ icon_doctor.png
   │  │  ├─ icon_emergency.png
   │  │  ├─ icon_hospital.png
   │  │  ├─ icon_lab.png
   │  │  ├─ icon_passport.png
   │  │  ├─ icon_prescription.png
   │  │  ├─ icon_profile.png
   │  │  ├─ icon_reminder.png
   │  │  ├─ icon_translator.png
   │  │  └─ icon_triage.png
   │  └─ logo.png
   ├─ index.html
   ├─ metadata.json
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  ├─ logo.png
   │  ├─ mr-cologist.jpg
   │  ├─ reel-angioplasty.jpg
   │  ├─ reel-biopsy.jpg
   │  ├─ reel-bloodgroup.jpg
   │  ├─ reel-brain clot surgery.jpg
   │  ├─ reel-heart.jpg
   │  ├─ reel-skinburn.jpg
   │  └─ robots.txt
   ├─ README.md
   ├─ src
   │  ├─ App.tsx
   │  ├─ components
   │  │  ├─ AddHospitalForm.tsx
   │  │  ├─ AdminGuard.tsx
   │  │  ├─ AdminPage.tsx
   │  │  ├─ AdminVerificationDashboard.tsx
   │  │  ├─ AuthModal.tsx
   │  │  ├─ BlogsPage.tsx
   │  │  ├─ Breadcrumbs.tsx
   │  │  ├─ CompleteProfile.tsx
   │  │  ├─ DiagnosticCenter.tsx
   │  │  ├─ DoctorDashboard.tsx
   │  │  ├─ DoctorsSection.tsx
   │  │  ├─ EmailLogin.tsx
   │  │  ├─ EmergencySOS.tsx
   │  │  ├─ ErrorBoundary.tsx
   │  │  ├─ HospitalLocator.tsx
   │  │  ├─ HospitalMap.tsx
   │  │  ├─ LandingPage.tsx
   │  │  ├─ LegalPage.tsx
   │  │  ├─ LiveChat.tsx
   │  │  ├─ MedicalHistoryView.tsx
   │  │  ├─ MedicineStore.tsx
   │  │  ├─ MrCologistCorner.tsx
   │  │  ├─ PharmacyDashboard.tsx
   │  │  ├─ PostCheckoutPanel.tsx
   │  │  ├─ PrescriptionAnalyzer.tsx
   │  │  ├─ ReceiptPrinter.tsx
   │  │  ├─ SevaAIBot.tsx
   │  │  ├─ SmartProviderForm.tsx
   │  │  ├─ SymptomChecker.tsx
   │  │  ├─ UserProfileModal.tsx
   │  │  ├─ VideoConsultation.tsx
   │  │  └─ WeakPage.tsx
   │  ├─ data.ts
   │  ├─ index.css
   │  ├─ main.tsx
   │  ├─ supabase.ts
   │  ├─ types.ts
   │  └─ vite-env.d.ts
   ├─ test-genai-models.js
   ├─ test-genai.js
   ├─ tsconfig.json
   ├─ vercel.json
   └─ vite.config.ts

```