

export interface User {
    uid: string;
    email: string;
    role: 'customer' | 'doctor' | 'clinic' | 'hospital' | 'diagnostics_centres' | 'admin';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string[];
  experience: number; // in years
  imageUrl: string;
  dataAiHint?: string;
  rating: number;
  reviewCount: number;
  clinicId: string;
  bio: string;
  consultationFee: number;
  availableSlots: { time: string, isAvailable: boolean }[];
  address?: string; // For house calls
}

export interface Clinic {
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

export interface Appointment {
  id: string;
  patientId: string; // Corresponds to user's UID
  patientName: string; 
  doctor: Doctor;
  clinic: Clinic;
  time: string;
  date: string; // ISO string
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  appointmentType: 'clinic' | 'video';
  token: string;
  feeDetails: {
    consultationFee: number;
    platformFee: number;
    total: number;
  };
  videoConsultDetails?: VideoConsultationDetails;
  feedback?: AppointmentFeedback;
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
  lastUpdated: any; // Can be Date or Firebase Timestamp
}


// --- Diagnostics Types ---

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
