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
  walletAddress?: string;
  sanjeevaniPoints?: number;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  age?: number;
  dob?: string;
}

export interface BloodInventory {
  'A+': number;
  'A-': number;
  'B+': number;
  'B-': number;
  'O+': number;
  'O-': number;
  'AB+': number;
  'AB-': number;
}

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  available: boolean;
  lastDonated: string;
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
  bloodInventory?: BloodInventory;
  lastUpdated: any;
  onChainVerified?: boolean;
  lastVerificationHash?: string;
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
  dataAiHint?: string;
  doctors: DoctorDetails[];
  about?: string;
}

export interface ClinicProfile extends Omit<User, 'name'>, Omit<ClinicDetails, 'id' | 'userId'> {
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  clinicId?: string;
  centreId?: string;
  hospitalId?: string;
  type: 'clinic' | 'video' | 'test' | 'bed';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledAt: any;
  createdAt: any;
  date: any; 
  bedType?: string;
  testName?: string;
  patient?: User;
  doctor?: DoctorProfile;
  clinic?: ClinicProfile;
  hospital?: Hospital;
  centre?: DiagnosticsCentre;
  onChainHash?: string;
  txHash?: string;
}

export interface MedicalRecord {
  id: string;
  userId: string;
  patientName: string;
  age: number;
  hospitalName: string;
  testType: string;
  testDate: string;
  fileUrl: string;
  onChainHash: string;
  txHash: string;
  verified: boolean;
  createdAt: string;
}

export interface RewardActivity {
  id: string;
  userId: string;
  action: 'Record Upload' | 'Hospital Update' | 'Blood Donation' | 'Doctor Verification' | 'Payment Proof';
  points: number;
  timestamp: string;
  txHash?: string;
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

export interface DiagnosticTest {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Pathologist {
  id: string;
  name: string;
  qualifications: string[];
  imageUrl: string;
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
  onChainHash?: string;
  txHash?: string;
}

export interface AppointmentFeedback {
    doctorBehaviour: number;
    clinicExperience: number;
    overallService: number;
    comments: string;
}

export interface AyurvedaRecommendation {
  disease: string;
  hindi_name: string;
  marathi_name: string;
  doshas: string[];
  prakriti: string;
  herbs: string[];
  formulation: string;
  yoga: string[];
  diet: {
    eat: string[];
    avoid: string[];
  };
  routine: {
    time: string;
    action: string;
  }[];
  prevention: string;
  severity: string;
  prognosis: string;
  medical_intervention: string[];
  complications: string[];
}
