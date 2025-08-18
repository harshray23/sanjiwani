
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

export interface Appointment {
  id: string;
  patientId: string; // Corresponds to user's UID
  patientName: string; 
  doctor: Doctor;
  clinic: Clinic;
  time: string;
  date: string; // e.g., "2024-07-30"
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  appointmentType: 'clinic' | 'video';
  token: string;
  feeDetails: {
    consultationFee: number;
    platformFee: number;
    total: number;
  };
  videoConsultDetails?: VideoConsultationDetails;
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
