

import type { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'clinic' | 'hospital' | 'diagnostics_centres' | 'admin';
  verified: boolean;
  createdAt: any;
  medicalHistory?: any;
}

export interface DoctorDetails {
  id: string;
  userId: string;
  name: string;
  email: string; 
  specialization: string;
  licenseNo: string;
  consultationFee: number;
  availability: string[];
  clinicId?: string;
  verified?: boolean;
  imageUrl?: string;
  phone?: string;
  clinicName?: string | null;
}

export interface DoctorProfile extends User, Omit<DoctorDetails, 'id' | 'userId' | 'name' | 'email'> {
}

export interface ClinicDetails {
  id: string;
  userId: string;
  name: string;
  address: string;
  licenseNo: string;
  verified: boolean;
  imageUrl?: string;
  doctors: DoctorDetails[];
  about?: string;
}

export interface ClinicProfile extends Omit<User, 'name'>, Omit<ClinicDetails, 'id' | 'userId'> {
}

export interface DiagnosisCentreDetails {
  id: string;
  userId: string;
  name: string;
  servicesOffered: string[];
  licenseNo: string;
  verified: boolean;
}

export interface DiagnosisCentreProfile extends Omit<User, 'name'>, Omit<DiagnosisCentreDetails, 'id' | 'userId'> {
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  clinicId?: string;
  centreId?: string;
  type: 'clinic' | 'video' | 'test';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledAt: any;
  createdAt: any;
  date: any; // for clinic dashboard
  patient?: User;
  doctor?: DoctorProfile;
  clinic?: ClinicProfile;
}

export interface Report {
  id: string;
  appointmentId: string;
  uploadedBy: string;
  fileUrl: string;
  createdAt: any;
}

export interface Payment {
  id: string;
  userId: string;
  serviceId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  createdAt: any;
}

export interface AdminLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: any;
}

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
  lastUpdated: any;
}

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
  reportUrl?: string;
}
