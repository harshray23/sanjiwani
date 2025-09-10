

import type { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string; // This will be the document ID from Firestore
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'clinic' | 'diag_centre' | 'admin';
  verified: boolean;
  createdAt: any; // serverTimestamp
  medicalHistory?: any; // To be defined later
}

// Represents the document in the /doctors collection
export interface DoctorDetails {
  id: string; // The document ID, which should match the user ID
  userId: string; // Reference to the user in /users/{userId}
  name: string;
  specialization: string;
  licenseNo: string;
  consultationFee: number;
  availability: string[]; // Array of time slots
  clinicId?: string;
  verified?: boolean; // Now part of the details
  imageUrl?: string;
  phone?: string;
}

// A complete Doctor profile, combining User and DoctorDetails
export interface DoctorProfile extends User, Omit<DoctorDetails, 'id' | 'userId' | 'name'> {
  // Inherits all fields from User
  // and adds specialization, licenseNo, etc.
  // We use the User uid as the primary ID.
}

// Represents the document in the /clinics collection
export interface ClinicDetails {
  id: string; // The document ID, which should match the user ID
  userId: string; // Reference to the user in /users/{userId}
  name: string;
  address: string;
  licenseNo: string;
  verified: boolean;
}

// A complete Clinic profile, combining User and ClinicDetails
export interface ClinicProfile extends Omit<User, 'name'>, Omit<ClinicDetails, 'id' | 'userId'> {
    // We use ClinicDetails.name, so we omit User.name
}


// Represents the document in the /diagnosisCentres collection
export interface DiagnosisCentreDetails {
  id: string; // The document ID, which should match the user ID
  userId: string; // Reference to the user in /users/{userId}
  name: string;
  servicesOffered: string[];
  licenseNo: string;
  verified: boolean;
}

// A complete Diagnosis Centre profile
export interface DiagnosisCentreProfile extends Omit<User, 'name'>, Omit<DiagnosisCentreDetails, 'id' | 'userId'> {
    // Uses name from DiagnosisCentreDetails
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId?: string;
  clinicId?: string;
  centreId?: string;
  type: 'token' | 'video' | 'test';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledAt: any; // Timestamp
  createdAt: any; // Timestamp

  // --- Populated data ---
  patient?: User;
  doctor?: DoctorProfile;
  clinic?: ClinicProfile;
  // centre?: DiagnosisCentreProfile;
}

export interface Report {
  id: string;
  appointmentId: string;
  uploadedBy: string; // doctorId or centreId
  fileUrl: string;
  createdAt: any; // Timestamp
}

export interface Payment {
  id: string;
  userId: string;
  serviceId: string; // appointmentId or testId
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  createdAt: any; // Timestamp
}

export interface AdminLog {
  id: string;
  action: string;
  performedBy: string; // userId
  timestamp: any; // Timestamp
}

// --- Old types for reference, to be removed/refactored ---

export interface VideoConsultationDetails {
    meetingLink: string;
    preliminaryAdvice: string;
}

export interface AppointmentFeedback {
    doctorBehaviour: number;
    clinicExperience: number;
    overallService: number;
    comments: string;
}

// Legacy Doctor type
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualifications: string[] | string;
  experience: number;
  imageUrl: string;
  dataAiHint?: string;
  rating: number;
  reviewCount: number;
  clinicId: string;
  bio: string;
  consultationFee: number;
  availableSlots: { time: string, isAvailable: boolean }[];
  address?: string;
}

// Legacy Clinic type
export type Clinic = {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  dataAiHint?: string;
  rating: number;
  specialties: string[];
  doctors: Doctor[];
  about: string;
  contact: {
    phone: string;
    address: string;
  }
}

// Legacy Hospital Type
export interface Hospital {
  id: string;
  name: string;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  contact: string;
  rating: number;
  specialties: string[];
  imageUrl?: string;
  dataAiHint?: string;
  emergencyAvailable: boolean;
  beds: {
    general: { total: number; available: number };
    icu: { total: number; available: number };
    ventilator: { total: number; available: number };
    oxygen: { total: number; available: number };
  };
  lastUpdated: any; // Can be Date or Firebase Timestamp
}

// Legacy Diagnostics Types
export interface Pathologist {
  id: string;
  name: string;
  qualifications: string[];
  imageUrl: string;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface DiagnosticsCentre {
  id: string;
  name: string;
  location: string;
  contact: {
    phone: string;
    email: string;
  },
  rating: number;
  imageUrl: string;
  dataAiHint?: string;
  tests: DiagnosticTest[];
  pathologists: Pathologist[];
}

export interface TestAppointment {
  id: string;
  patientId: string;
  patientName: string;
  centreId: string;
  test: DiagnosticTest;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Report Ready' | 'Cancelled';
  reportUrl?: string; // Link to the PDF report
}
