import { Doctor, Hospital, Medicine, MedicalRecord } from './types';

// DEMO DOCTORS REMOVED FOR PRODUCTION / MAINTENANCE
export const DOCTORS: Doctor[] = [];

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'SevaDharam Community Charitable Hospital',
    distance: '0.8 km',
    address: 'Sector 4, Near Gandhi Park, Main Road',
    contact: '+91 98765 12340',
    emergencyBeds: 18,
    occupancyRate: '65%',
    lat: 28.6139,
    lng: 77.2090,
    type: 'Charity',
    rating: 4.8
  },
  {
    id: 'hosp-2',
    name: 'City Apex Super-Specialty Hospital',
    distance: '2.3 km',
    address: 'Ring Road, Sector 12, Metro Pillar 104',
    contact: '+91 98765 56789',
    emergencyBeds: 5,
    occupancyRate: '92%',
    lat: 28.6210,
    lng: 77.2150,
    type: 'Private',
    rating: 4.6
  },
  {
    id: 'hosp-3',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    distance: '4.1 km',
    address: 'Ansari Nagar East, New Delhi',
    contact: '+91 11 2658 8500',
    emergencyBeds: 45,
    occupancyRate: '98%',
    lat: 28.5672,
    lng: 77.2100,
    type: 'Government',
    rating: 4.9
  },
  {
    id: 'hosp-4',
    name: 'Red Cross Emergency Clinic',
    distance: '1.5 km',
    address: 'Block B, Kasturba Gandhi Marg',
    contact: '+91 98765 99111',
    emergencyBeds: 12,
    occupancyRate: '40%',
    lat: 28.6180,
    lng: 77.2250,
    type: 'Charity',
    rating: 4.5
  }
];

export const MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol 650mg (Dolo)',
    category: 'Fever & Pain Relief',
    price: 32,
    dosage: '1 tablet as needed',
    frequency: 'Max 3 times daily, after food',
    inStock: true,
    reminderEnabled: false
  },
  {
    id: 'med-2',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    price: 110,
    dosage: '1 tablet',
    frequency: 'Twice daily for 5 days',
    inStock: true,
    reminderEnabled: false
  },
  {
    id: 'med-3',
    name: 'Atorvastatin 10mg (Lipitor)',
    category: 'Cholesterol/Heart',
    price: 145,
    dosage: '1 tablet',
    frequency: 'Once daily at bedtime',
    inStock: true,
    reminderEnabled: true
  },
  {
    id: 'med-4',
    name: 'Pantoprazole 40mg (Pan-D)',
    category: 'Acidity & Reflux',
    price: 58,
    dosage: '1 tablet',
    frequency: 'Once daily, 30 mins before breakfast',
    inStock: true,
    reminderEnabled: true
  },
  {
    id: 'med-5',
    name: 'Cetirizine 10mg (Okacet)',
    category: 'Allergy & Cold',
    price: 18,
    dosage: '1 tablet',
    frequency: 'Once daily at night if needed',
    inStock: true,
    reminderEnabled: false
  },
  {
    id: 'med-6',
    name: 'Metformin SR 500mg (Glycomet)',
    category: 'Diabetes Control',
    price: 45,
    dosage: '1 tablet',
    frequency: 'Twice daily, with lunch and dinner',
    inStock: true,
    reminderEnabled: true
  }
];

export const MEDICAL_HISTORY: MedicalRecord[] = [
  {
    id: 'rec-1',
    date: 'June 20, 2026',
    type: 'Consultation',
    doctorName: 'Dr. Aarav Sharma',
    title: 'Seasonal Flu & Fever Consultation',
    description: 'Diagnosed with moderate viral flu. Recommended rest, hydration, and Paracetamol 650mg for 3 days.',
    status: 'Completed',
    fileAttached: 'Prescription_Flu_2026.pdf'
  },
  {
    id: 'rec-2',
    date: 'May 14, 2026',
    type: 'Lab Report',
    title: 'Annual Comprehensive Blood Panel',
    description: 'All values within normal range except slightly elevated LDL cholesterol (135 mg/dL) and Vitamin D deficiency.',
    status: 'Analyzed by Seva AI',
    fileAttached: 'Blood_Report_May_2026.pdf'
  },
  {
    id: 'rec-3',
    date: 'March 02, 2026',
    type: 'Prescription',
    doctorName: 'Dr. Ananya Iyer',
    title: 'Child Care Immunity Routine',
    description: 'Immunity multivitamin booster prescription and vaccination schedule log verification.',
    status: 'Active Reminders',
    fileAttached: 'Pediatric_Routine_March.pdf'
  }
];


export const BLOGS = [
  {
    id: 'b-1',
    title: 'Preventive Cardiology: 5 Habits for a Vibrant Heart',
    excerpt: 'Simple daily choices like sodium control, active brisk walking, and managing stress levels play a major role in heart health.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=300&auto=format&fit=crop',
    date: 'July 01, 2026',
    author: 'Dr. Kabir Mehta'
  },
  {
    id: 'b-2',
    title: 'Understanding Pediatric Allergies in Monsoon',
    excerpt: 'Monsoons bring humidity and dampness, which can trigger asthma or pollen allergies in children. Read guidelines to secure your kids.',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=300&auto=format&fit=crop',
    date: 'June 28, 2026',
    author: 'Dr. Ananya Iyer'
  },
  {
    id: 'b-3',
    title: 'Deciphering Your Blood Pressure Readings',
    excerpt: 'What do Systolic and Diastolic values actually mean? Learn to monitor your blood pressure accurately from home.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=300&auto=format&fit=crop',
    date: 'June 15, 2026',
    author: 'Dr. Aarav Sharma'
  },
  {
    id: 'b-4',
    title: 'The Truth About Intermittent Fasting',
    excerpt: 'Is intermittent fasting right for everyone? Explore the science, benefits, and potential risks of this popular diet trend.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=300&auto=format&fit=crop',
    date: 'May 12, 2026',
    author: 'Dr. Sneha Patel'
  },
  {
    id: 'b-5',
    title: 'Managing Screen Time for Better Sleep',
    excerpt: 'Blue light from devices can disrupt your circadian rhythm. Learn practical tips to disconnect and improve your sleep quality.',
    image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=300&auto=format&fit=crop',
    date: 'April 05, 2026',
    author: 'Dr. Rohan Desai'
  },
  {
    id: 'b-6',
    title: 'Immunity Boosting Foods for Winter',
    excerpt: 'Discover the top foods packed with vitamins and antioxidants to keep your immune system strong during the colder months.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop',
    date: 'March 20, 2026',
    author: 'Dr. Priya Kapoor'
  }
];