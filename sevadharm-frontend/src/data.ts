import { Doctor, Hospital, Medicine, MedicalRecord } from './types';

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Aarav Sharma',
    specialty: 'General Physician',
    qualification: 'MD, MBBS (AIIMS New Delhi)',
    experience: 12,
    rating: 4.9,
    fee: 400,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop',
    description: 'Specialist in internal medicine, lifestyle diseases, diabetes management, and preventive healthcare diagnostics. Over a decade of practice at top medical institutes.',
    availableSlots: ['09:00 AM', '10:30 AM', '11:00 AM', '03:00 PM', '04:30 PM'],
    tier: 'General',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Iyer',
    specialty: 'Pediatrician',
    qualification: 'MD in Pediatrics, DCH',
    experience: 9,
    rating: 4.8,
    fee: 500,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
    description: 'Caring pediatrician specializing in neonatal care, child growth monitoring, vaccination, and treating seasonal pediatric ailments.',
    availableSlots: ['10:00 AM', '11:30 AM', '12:00 PM', '02:30 PM', '05:00 PM'],
    tier: 'General',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri']
  },
  {
    id: 'doc-3',
    name: 'Dr. Kabir Mehta',
    specialty: 'Cardiologist',
    qualification: 'DM (Cardiology), MD, MBBS (FACC)',
    experience: 18,
    rating: 5.0,
    fee: 1200,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
    description: 'Senior interventional cardiologist focusing on coronary artery disease, heart failure management, and advanced cardiac pacing systems.',
    availableSlots: ['09:30 AM', '10:00 AM', '04:00 PM', '06:00 PM'],
    tier: 'Advance',
    availableDays: ['Tue', 'Thu', 'Sat']
  },
  {
    id: 'doc-4',
    name: 'Dr. Meera Patel',
    specialty: 'Gynecologist',
    qualification: 'MS, DNB (Obstetrics & Gynecology)',
    experience: 15,
    rating: 4.9,
    fee: 800,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Expertise in high-risk pregnancy care, infertility treatment, minimally invasive laparoscopic surgery, and adolescent health counseling.',
    availableSlots: ['11:00 AM', '12:30 PM', '03:30 PM', '05:30 PM'],
    tier: 'Advance',
    availableDays: ['Mon', 'Tue', 'Wed', 'Fri']
  },
  {
    id: 'doc-5',
    name: 'Dr. Rohan Das',
    specialty: 'Neurologist',
    qualification: 'DM (Neurology), MD (Internal Medicine)',
    experience: 14,
    rating: 4.7,
    fee: 1000,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
    description: 'Dedicated to treating migraine, stroke rehabilitation, epilepsy management, neuropathy, sleep disorders, and multiple sclerosis treatment.',
    availableSlots: ['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'],
    tier: 'Advance',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri']
  },
  {
    id: 'doc-6',
    name: 'Dr. Priya Nair',
    specialty: 'Dermatologist',
    qualification: 'MD (Dermatology, Venereology & Leprosy)',
    experience: 8,
    rating: 4.8,
    fee: 450,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Experienced skin specialist specializing in acne scar treatments, eczema, psoriasis, aesthetic dermatology, laser therapies, and hair loss solutions.',
    availableSlots: ['09:00 AM', '10:00 AM', '12:00 PM', '03:30 PM', '06:30 PM'],
    tier: 'General',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat']
  }
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'SevaDharm Community Charitable Hospital',
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

export const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Patient (Delhi)',
    text: 'SevaDharm has completely changed how my family accesses healthcare. Booked a general physician consult in minutes and ordered prescription medications directly. Highly recommend!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
  },
  {
    name: 'Dr. Sunita Deshmukh',
    role: 'Gynecologist (Mumbai)',
    text: 'As a partner doctor, SevaDharms interface enables seamless coordination with patients, high-quality video integration, and accurate diagnostic summaries prior to the call.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop'
  },
  {
    name: 'Preeti Singh',
    role: 'Patient (Gurugram)',
    text: 'The prescription analyzer is magical! I uploaded my handwriting prescription and Seva AI parsed it perfectly into plain english with daily safety alerts.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
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
