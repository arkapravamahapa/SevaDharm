export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number;
  rating: number;
  fee: number;
  image: string;
  description: string;
  availableSlots: string[];
  tier: 'General' | 'Advance';
  availableDays: string[]; // e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
}

export interface UserProfile {
  name: string;
  age: number;
  mobile: string;
  email: string;
  role?: 'patient' | 'doctor' | 'pharmacy';
  bloodGroup?: string;
  allergies?: string;
  chronicConditions?: string;
  emergencyContact?: string;
  smokingHabit?: 'Non-smoker' | 'Occasional' | 'Heavy';
  drinkingHabit?: 'Non-drinker' | 'Social' | 'Regular';
  stressLevel?: 'Low' | 'Medium' | 'High';
  sleepHours?: number;
  activityLevel?: 'Sedentary' | 'Lightly Active' | 'Highly Active';
  dietType?: 'Veg' | 'Non-Veg' | 'Vegan';
  weight?: number; // in kg
  height?: number; // in cm
  
  // Doctor specific fields
  specialty?: string;
  qualification?: string;
  experience?: string;
  expertise?: string;
}

export interface Booking {
  id: string;
  doctor: Doctor;
  date: string;
  timeSlot: string;
  type: 'online' | 'offline';
  doctorFee: number;
  platformFee: number;
  totalFee: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingTime: string;
}

export interface Hospital {
  id: string;
  name: string;
  distance: string;
  address: string;
  contact: string;
  emergencyBeds: number;
  occupancyRate: string;
  lat: number;
  lng: number;
  type: 'Government' | 'Private' | 'Charity';
  rating: number;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  dosage: string;
  frequency: string;
  inStock: boolean;
  reminderEnabled: boolean;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Consultation' | 'Prescription' | 'Lab Report';
  doctorName?: string;
  title: string;
  description: string;
  status: string;
  fileAttached?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'seva-ai';
  text: string;
  timestamp: Date;
  status?: 'typing' | 'sent';
  triageDetails?: {
    severity: 'Low' | 'Medium' | 'High' | 'Emergency';
    possibleCauses: string[];
    remedies: string[];
    recommendedSpecialty: string;
  };
}

export interface Session {
  id: string;
  patientName: string;
  date?: string;
  time?: string;
  type?: string;
  diagnosis?: string;
  status?: 'Waiting' | 'Upcoming' | 'Completed' | string;
}
