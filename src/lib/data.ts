

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
  orderBy,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Doctor, Clinic, Hospital, Appointment, VideoConsultationDetails, AppointmentFeedback, DiagnosticsCentre, DiagnosticTest, Pathologist, TestAppointment, User } from './types';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Role } from '@/app/login/page';

// Helper to convert Firestore Timestamps to serializable strings in nested objects
const convertTimestamps = (data: any): any => {
    if (data instanceof Timestamp) {
        return data.toDate().toISOString();
    }
    if (Array.isArray(data)) {
        return data.map(convertTimestamps);
    }
    if (data !== null && typeof data === 'object') {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            newData[key] = convertTimestamps(data[key]);
        }
        return newData;
    }
    return data;
};


// Generic function to get documents from a collection
async function getCollection<T>(collectionName: string): Promise<T[]> {
    if (!db) {
        console.error("Firestore not initialized");
        return [];
    }
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// Generic function to get a document by ID
async function getDocumentById<T>(collectionName:string, id: string): Promise<T | undefined> {
     if (!db) {
        console.error("Firestore not initialized");
        return undefined;
    }
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;
        return convertTimestamps(data);
    }
    return undefined;
}


export const getUsers = async (): Promise<User[]> => {
    return getCollection<User>('users');
}

export const createUserInFirestore = async (user: FirebaseUser, role: Role, details: any) => {
    if (!db) throw new Error("Firestore not initialized");

    const userRef = doc(db, "users", user.uid);

    const userData: User = {
        uid: user.uid,
        email: user.email!,
        role: role,
        createdAt: serverTimestamp(),
        fullName: details.name,
        phone: details.phone,
        address: details.address,
    };

    await setDoc(userRef, userData);
    return userData;
}

export const getClinics = async (): Promise<Clinic[]> => {
    return getCollection<Clinic>('clinics');
};

export const getClinicById = async (id: string): Promise<Clinic | undefined> => {
    if (!db) return undefined;
    const clinic = await getDocumentById<Clinic>('clinics', id);
    if(clinic) {
        // Fetch doctors for this clinic
        const q = query(collection(db!, 'doctors'), where('clinicId', '==', id));
        const doctorsSnapshot = await getDocs(q);
        clinic.doctors = doctorsSnapshot.docs.map(d => ({id: d.id, ...d.data()} as Doctor));
    }
    return clinic;
};

export const getDoctors = async (): Promise<Doctor[]> => {
    return getCollection<Doctor>('doctors');
};

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
    return getDocumentById<Doctor>('doctors', id);
};

export const searchClinicsAndDoctors = async (queryText: string): Promise<{ clinics: Clinic[], doctors: Doctor[] }> => {
    if (!db) {
        console.error("Firestore not initialized");
        return { clinics: [], doctors: [] };
    }
    const lowerCaseQuery = queryText.toLowerCase();
    
    const [allClinics, allDoctors] = await Promise.all([getClinics(), getDoctors()]);
    
    const filteredClinics = allClinics.filter(clinic =>
        clinic.name.toLowerCase().includes(lowerCaseQuery) ||
        clinic.location.toLowerCase().includes(lowerCaseQuery) ||
        clinic.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery))
    );

    const filteredDoctors = allDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(lowerCaseQuery) ||
        doctor.specialty.toLowerCase().includes(lowerCaseQuery)
    );

    return { clinics: filteredClinics, doctors: filteredDoctors };
};

export const getHospitals = async (): Promise<Hospital[]> => {
    const hospitals = await getCollection<Hospital>('hospitals');
    const comprehensiveSpecialties = [
        "Cardiology", "Dermatology", "Neurology", "Oncology", "Pediatrics", 
        "Orthopedics", "Gastroenterology", "Endocrinology", "Pulmonology", 
        "Nephrology", "Urology", "Gynecology", "Ophthalmology", "ENT",
        "Psychiatry", "Anesthesiology", "Radiology", "General Surgery", 
        "Plastic Surgery", "Vascular Surgery", "Infectious Disease", "Rheumatology",
        "Surgical Oncology", "Medical Oncology", "Hepatology", "Pulmonary Medicine / Critical Care"
    ];

    // Assign a varied set of specialties to each hospital for better filtering demo
    return hospitals.map((hospital, index) => ({
      ...hospital,
      specialties: comprehensiveSpecialties.slice(index % 5, (index % 5) + Math.floor(Math.random() * 5) + 3)
    }));
};

export const searchHospitals = async (queryText: string): Promise<Hospital[]> => {
    if (!db) return [];
    const allHospitals = await getHospitals();
    const lowerCaseQuery = queryText.toLowerCase();
    
    return allHospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(lowerCaseQuery) || 
        hospital.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery)) ||
        hospital.location.address.toLowerCase().includes(lowerCaseQuery)
    );
};

export const getDiagnosticsCentres = async (): Promise<DiagnosticsCentre[]> => {
    if(!db) return [];
    const centres = await getCollection<DiagnosticsCentre>('diagnostics');
    for(const centre of centres) {
        centre.tests = await getCollection<DiagnosticTest>(`diagnostics/${centre.id}/tests`);
        centre.pathologists = await getCollection<Pathologist>(`diagnostics/${centre.id}/pathologists`);
    }
    return centres;
};

export const getDiagnosticsCentreById = async (id: string): Promise<DiagnosticsCentre | undefined> => {
    if (!db) return undefined;
    const centre = await getDocumentById<DiagnosticsCentre>('diagnostics', id);
    if(centre) {
        centre.tests = await getCollection<DiagnosticTest>(`diagnostics/${id}/tests`);
        centre.pathologists = await getCollection<Pathologist>(`diagnostics/${id}/pathologists`);
    }
    return centre;
};

export const getTestAppointmentsForCentre = async (centreId: string): Promise<TestAppointment[]> => {
  if (!db) return [];
  const q = query(collection(db, 'testAppointments'), where('centreId', '==', centreId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() }) as TestAppointment);
};


// --- Appointment Management ---
export const getAppointments = async (): Promise<Appointment[]> => {
    const appointments = await getCollection<Appointment>('appointments');
    return Promise.all(appointments.map(resolveAppointmentRefs));
};

export const createAppointment = async (
  patientId: string, 
  patientName: string, 
  doctorId: string, 
  slot: string
): Promise<Appointment> => {
    if (!db) throw new Error("Firestore not initialized");

    const doctor = await getDoctorById(doctorId);
    if (!doctor) throw new Error("Doctor not found");
    const clinic = await getClinicById(doctor.clinicId);
    if (!clinic) throw new Error("Clinic not found");

    const platformFee = 50;
    const newAppointmentData = {
      patientId,
      patientName,
      doctor: doc(db, 'doctors', doctorId), // Store as reference
      clinic: doc(db, 'clinics', doctor.clinicId), // Store as reference
      time: slot,
      date: Timestamp.now(),
      status: 'Confirmed',
      appointmentType: 'clinic',
      token: `TKN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      feeDetails: {
        consultationFee: doctor.consultationFee,
        platformFee,
        total: doctor.consultationFee + platformFee
      }
    };
    
    const docRef = await addDoc(collection(db, "appointments"), newAppointmentData);
    
    // Construct the object to return, resolving references for immediate use
    const returnedAppointment = {
        id: docRef.id,
        ...newAppointmentData,
        doctor: doctor, 
        clinic: clinic,
        date: newAppointmentData.date.toDate().toISOString(),
    } as unknown as Appointment;

    return returnedAppointment;
};

export const createVideoConsultationAppointment = async (
  patientId: string, 
  patientName: string, 
  doctorId: string,
  videoConsultDetails: VideoConsultationDetails
): Promise<Appointment> => {
  if (!db) throw new Error("Firestore not initialized");

  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  const clinic = await getClinicById(doctor.clinicId);
  if (!clinic) throw new Error("Clinic not found");

  const platformFee = 100;
  const newAppointmentData = {
      patientId,
      patientName,
      doctor: doc(db, 'doctors', doctorId),
      clinic: doc(db, 'clinics', doctor.clinicId),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      date: Timestamp.now(),
      status: 'Confirmed',
      appointmentType: 'video',
      token: `TKN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      feeDetails: {
        consultationFee: doctor.consultationFee,
        platformFee,
        total: doctor.consultationFee + platformFee
      },
      videoConsultDetails: videoConsultDetails
  };

  const docRef = await addDoc(collection(db, "appointments"), newAppointmentData);
  
  const returnedAppointment = {
      id: docRef.id,
      ...newAppointmentData,
      doctor: doctor,
      clinic: clinic,
      date: newAppointmentData.date.toDate().toISOString(),
  } as unknown as Appointment;

  return returnedAppointment;
};

const resolveAppointmentRefs = async (appointment: any): Promise<Appointment> => {
    if (appointment.doctor && typeof appointment.doctor.get === 'function') {
        const doctorSnap = await getDoc(appointment.doctor);
        appointment.doctor = { id: doctorSnap.id, ...doctorSnap.data() } as Doctor;
    }
     if (appointment.clinic && typeof appointment.clinic.get === 'function') {
        const clinicSnap = await getDoc(appointment.clinic);
        appointment.clinic = { id: clinicSnap.id, ...clinicSnap.data() } as Clinic;
    }
    return convertTimestamps(appointment);
}

export const getAppointmentsForUser = async (patientId: string): Promise<Appointment[]> => {
  if (!db) return [];
  const q = query(
      collection(db, 'appointments'), 
      where('patientId', '==', patientId),
      orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Resolve doctor and clinic references
  return Promise.all(appointments.map(resolveAppointmentRefs));
};

export const getAppointmentsForDoctor = async (doctorId: string): Promise<Appointment[]> => {
  if (!db) return [];
  const q = query(
      collection(db, 'appointments'), 
      where('doctor', '==', doc(db, 'doctors', doctorId)),
      orderBy('date', 'desc')
    );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return Promise.all(appointments.map(resolveAppointmentRefs));
};


export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
   if(!db) return undefined;
   const appointment = await getDocumentById<any>('appointments', id);
   if(appointment) {
       return resolveAppointmentRefs(appointment);
   }
   return undefined;
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    if (!db) return;
    const appDoc = doc(db, 'appointments', id);
    await updateDoc(appDoc, { status });
};

export const updateAppointmentWithVideoConsult = async (id: string, details: VideoConsultationDetails) => {
    if (!db) return;
    const appDoc = doc(db, 'appointments', id);
    await updateDoc(appDoc, { videoConsultDetails: details });
};

export const submitAppointmentFeedback = async (id: string, feedback: AppointmentFeedback) => {
    if (!db) return;
    const appDoc = doc(db, 'appointments', id);
    await updateDoc(appDoc, { feedback });
}

export const getAppointmentsForClinic = async (clinicId: string): Promise<Appointment[]> => {
    if (!db) return [];
    const q = query(
        collection(db, 'appointments'),
        where('clinic', '==', doc(db, 'clinics', clinicId)),
        orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return Promise.all(appointments.map(resolveAppointmentRefs));
};

    