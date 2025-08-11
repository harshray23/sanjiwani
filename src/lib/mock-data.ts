
import type { Doctor, Clinic } from './types';

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
