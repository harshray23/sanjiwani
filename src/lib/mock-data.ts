
import type { Doctor, Clinic, Hospital, Appointment } from './types';
import { Timestamp } from 'firebase/firestore';

const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Emily Carter',
    specialty: 'Cardiology',
    qualifications: ['MD', 'FACC'],
    experience: 15,
    imageUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'female doctor',
    rating: 4.9,
    reviewCount: 234,
    clinicId: 'clinic-1',
    bio: 'Dr. Carter is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She is known for her patient-centric approach.',
    consultationFee: 500,
    availableSlots: [
      { time: '09:00 AM', isAvailable: true },
      { time: '10:00 AM', isAvailable: false },
      { time: '11:00 AM', isAvailable: true },
      { time: '02:00 PM', isAvailable: true },
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Ben Hanson',
    specialty: 'General Medicine',
    qualifications: ['MBBS'],
    experience: 8,
    imageUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'male doctor',
    rating: 4.7,
    reviewCount: 150,
    clinicId: 'clinic-1',
    bio: 'Dr. Hanson is a dedicated general physician focusing on preventive care and overall wellness.',
    consultationFee: 300,
    availableSlots: [
      { time: '09:30 AM', isAvailable: true },
      { time: '10:30 AM', isAvailable: false },
      { time: '11:30 AM', isAvailable: false },
      { time: '02:30 PM', isAvailable: true },
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Olivia Chen',
    specialty: 'Dentistry',
    qualifications: ['DDS', 'MSD'],
    experience: 12,
    imageUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'female dentist',
    rating: 4.8,
    reviewCount: 312,
    clinicId: 'clinic-2',
    bio: 'Dr. Chen provides comprehensive dental care, from routine check-ups to advanced cosmetic procedures.',
    consultationFee: 400,
     availableSlots: [
      { time: '10:00 AM', isAvailable: true },
      { time: '11:00 AM', isAvailable: true },
      { time: '12:00 PM', isAvailable: false },
      { time: '03:00 PM', isAvailable: true },
    ]
  },
   {
    id: 'doc-4',
    name: 'Dr. Liam Wilson',
    specialty: 'Pediatrics',
    qualifications: ['MD', 'FAAP'],
    experience: 18,
    imageUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'male pediatrician',
    rating: 4.9,
    reviewCount: 450,
    clinicId: 'clinic-3',
    bio: 'With nearly two decades of experience, Dr. Wilson is a trusted pediatrician specializing in child development and care.',
    consultationFee: 450,
     availableSlots: [
      { time: '09:00 AM', isAvailable: false },
      { time: '10:00 AM', isAvailable: true },
      { time: '02:00 PM', isAvailable: true },
      { time: '04:00 PM', isAvailable: false },
    ]
  }
];

const clinics: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'City Central Clinic',
    location: '123 Health St, Downtown, Metro City',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'modern clinic',
    rating: 4.8,
    specialties: ['Cardiology', 'General Medicine', 'Neurology'],
    doctors: doctors.filter(d => d.clinicId === 'clinic-1'),
    about: 'City Central Clinic is a state-of-the-art multi-specialty facility committed to providing the highest quality healthcare services in the heart of the city.',
    contact: {
      phone: '(123) 456-7890',
      address: '123 Health St, Downtown, Metro City'
    }
  },
  {
    id: 'clinic-2',
    name: 'Sunrise Dental Care',
    location: '456 Smile Ave, Suburbia, Metro City',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'dental office',
    rating: 4.9,
    specialties: ['Dentistry', 'Orthodontics', 'Cosmetic Dentistry'],
    doctors: doctors.filter(d => d.clinicId === 'clinic-2'),
    about: 'Sunrise Dental Care offers a complete range of dental services. Our friendly staff and expert dentists are here to ensure you leave with a bright, healthy smile.',
    contact: {
      phone: '(123) 555-1234',
      address: '456 Smile Ave, Suburbia, Metro City'
    }
  },
  {
    id: 'clinic-3',
    name: 'Wellness Pediatrics',
    location: '789 Child Way, Lakeside, Metro City',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'childrens hospital',
    rating: 4.9,
    specialties: ['Pediatrics', 'Child Psychology', 'Adolescent Medicine'],
    doctors: doctors.filter(d => d.clinicId === 'clinic-3'),
    about: 'At Wellness Pediatrics, we provide compassionate and comprehensive care for infants, children, and adolescents. Your child\'s health is our top priority.',
    contact: {
      phone: '(123) 777-8888',
      address: '789 Child Way, Lakeside, Metro City'
    }
  },
];

const hospitals: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Metro General Hospital',
    location: {
      address: '101 Healing Ave, Metro City',
      coordinates: { latitude: 12.9716, longitude: 77.5946 }
    },
    contact: '(123) 111-2222',
    rating: 4.7,
    specialties: ['cardiology', 'neurology', 'orthopedics', 'emergency medicine'],
    emergencyAvailable: true,
    beds: {
      general: { total: 200, available: 45 },
      icu: { total: 40, available: 5 },
      ventilator: { total: 20, available: 2 },
      oxygen: { total: 80, available: 15 },
    },
    lastUpdated: Timestamp.now(),
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'large hospital'
  },
  {
    id: 'hosp-2',
    name: 'Suburb Community Hospital',
    location: {
      address: '202 Care Rd, Suburbia',
      coordinates: { latitude: 12.9545, longitude: 77.6483 }
    },
    contact: '(123) 333-4444',
    rating: 4.5,
    specialties: ['general medicine', 'pediatrics', 'gynecology'],
    emergencyAvailable: true,
    beds: {
      general: { total: 100, available: 12 },
      icu: { total: 15, available: 0 },
      ventilator: { total: 5, available: 0 },
      oxygen: { total: 30, available: 8 },
    },
    lastUpdated: Timestamp.fromMillis(Date.now() - 3600000), // 1 hour ago
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'community hospital'
  },
  {
    id: 'hosp-3',
    name: 'Lakeside Children\'s Hospital',
    location: {
      address: '303 Pedia Pl, Lakeside',
      coordinates: { latitude: 13.0000, longitude: 77.6000 }
    },
    contact: '(123) 555-6666',
    rating: 4.9,
    specialties: ['pediatrics', 'neonatology', 'pediatric surgery'],
    emergencyAvailable: false,
    beds: {
      general: { total: 80, available: 10 },
      icu: { total: 20, available: 3 },
      ventilator: { total: 10, available: 1 },
      oxygen: { total: 40, available: 12 },
    },
    lastUpdated: Timestamp.fromMillis(Date.now() - 86400000), // 1 day ago
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'childrens hospital'
  }
];

// In a real app, this would be a database. We'll use an in-memory array for now.
const appointments: Appointment[] = [];

// Helper functions to simulate data fetching
export const getClinics = async (): Promise<Clinic[]> => {
  return new Promise(resolve => setTimeout(() => resolve(clinics), 500));
};

export const getClinicById = async (id: string): Promise<Clinic | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(clinics.find(c => c.id === id)), 500));
};

export const getDoctors = async (): Promise<Doctor[]> => {
  return new Promise(resolve => setTimeout(() => resolve(doctors), 500));
};

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
  return new Promise(resolve => setTimeout(() => resolve(doctors.find(d => d.id === id)), 500));
};

export const searchClinicsAndDoctors = async (query: string): Promise<{ clinics: Clinic[], doctors: Doctor[] }> => {
  const lowerCaseQuery = query.toLowerCase();
  const filteredClinics = clinics.filter(clinic => 
    clinic.name.toLowerCase().includes(lowerCaseQuery) || 
    clinic.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery))
  );
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(lowerCaseQuery) ||
    doctor.specialty.toLowerCase().includes(lowerCaseQuery)
  );
  
  return new Promise(resolve => setTimeout(() => resolve({ clinics: filteredClinics, doctors: filteredDoctors }), 500));
};

export const getHospitals = async (): Promise<Hospital[]> => {
    return new Promise(resolve => setTimeout(() => resolve(hospitals), 500));
};

export const searchHospitals = async (query: string): Promise<Hospital[]> => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredHospitals = hospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(lowerCaseQuery) || 
        hospital.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery)) ||
        hospital.location.address.toLowerCase().includes(lowerCaseQuery)
    );
    return new Promise(resolve => setTimeout(() => resolve(filteredHospitals), 500));
};


// --- Appointment Management ---
export const createAppointment = async (
  patientId: string, 
  patientName: string, 
  doctorId: string, 
  slot: string
): Promise<Appointment> => {
  return new Promise(async (resolve, reject) => {
    const doctor = await getDoctorById(doctorId);
    if (!doctor) return reject("Doctor not found");
    const clinic = await getClinicById(doctor.clinicId);
    if (!clinic) return reject("Clinic not found");

    const platformFee = 50;
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId,
      patientName,
      doctor,
      clinic,
      time: slot,
      date: new Date().toISOString().split('T')[0], // Today's date
      status: 'Confirmed',
      token: `TKN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      feeDetails: {
        consultationFee: doctor.consultationFee,
        platformFee,
        total: doctor.consultationFee + platformFee
      }
    };

    // Simulate notifying doctor/clinic and saving to a database
    console.log("--- NEW APPOINTMENT BOOKED ---");
    console.log("PATIENT:", newAppointment.patientName);
    console.log("DOCTOR:", newAppointment.doctor.name);
    console.log("CLINIC:", newAppointment.clinic.name);
    console.log("TOKEN:", newAppointment.token);
    console.log("----------------------------");

    appointments.push(newAppointment);
    setTimeout(() => resolve(newAppointment), 500);
  });
};

export const getAppointmentsForUser = async (patientId: string): Promise<Appointment[]> => {
  return new Promise(resolve => {
    const userAppointments = appointments.filter(a => a.patientId === patientId);
    setTimeout(() => resolve(userAppointments), 500);
  });
};

export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
   return new Promise(resolve => {
    const appointment = appointments.find(a => a.id === id);
    setTimeout(() => resolve(appointment), 500);
  });
}
