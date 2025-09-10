


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
import type { 
    User, 
    DoctorProfile, 
    DoctorDetails,
    ClinicProfile,
    ClinicDetails,
    DiagnosisCentreProfile,
    DiagnosisCentreDetails,
    Appointment
} from './types';
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


// --- USER MANAGEMENT ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
    return getDocumentById<User>('users', uid);
};

export const createUserInFirestore = async (user: FirebaseUser, role: Role, baseData: any, detailsData: any) => {
    if (!db) throw new Error("Firestore not initialized");

    // 1. Create the main user document in /users
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        ...baseData,
        uid: user.uid,
        email: user.email!,
        role: role,
        verified: false, // Default verification status
        createdAt: serverTimestamp()
    });

    // 2. Create the role-specific details document if needed
    let detailsCollectionName: string | null = null;
    switch (role) {
        case 'doctor':
            detailsCollectionName = 'doctors';
            break;
        case 'clinic':
            detailsCollectionName = 'clinics';
            // Use clinic name from details for the main user doc name
            await updateDoc(userRef, { name: detailsData.name });
            break;
        case 'diag_centre':
            detailsCollectionName = 'diagnosisCentres';
             // Use centre name from details for the main user doc name
            await updateDoc(userRef, { name: detailsData.name });
            if (typeof detailsData.servicesOffered === 'string') {
                detailsData.servicesOffered = detailsData.servicesOffered.split(',').map((s: string) => s.trim()).filter(Boolean);
            }
            break;
        case 'patient':
        case 'admin':
            // No separate details collection for these roles
            break;
        default:
            throw new Error(`Invalid role for details creation: ${role}`);
    }

    if (detailsCollectionName) {
        const detailsRef = doc(db, detailsCollectionName, user.uid);
        await setDoc(detailsRef, {
            ...detailsData,
            userId: user.uid,
        });
    }

    const userProfile = await getDoc(userRef);
    return userProfile.data();
}

// --- DATA FETCHING (DOCTORS, CLINICS, etc.) ---

export const getDoctors = async (): Promise<DoctorProfile[]> => {
    const doctorDetailsList = await getCollection<DoctorDetails>('doctors');
    const doctorProfiles = await Promise.all(doctorDetailsList.map(async (details) => {
        const userProfile = await getDocumentById<User>('users', details.userId);
        if (!userProfile) return null;
        return { ...userProfile, ...details, id: userProfile.uid } as DoctorProfile;
    }));
    return doctorProfiles.filter((p): p is DoctorProfile => p !== null);
};


export const getDoctorById = async (id: string): Promise<DoctorProfile | undefined> => {
    const userProfile = await getDocumentById<User>('users', id);
    if (!userProfile || userProfile.role !== 'doctor') return undefined;
    
    const doctorDetails = await getDocumentById<DoctorDetails>('doctors', id);
    if (!doctorDetails) return undefined;

    return { ...userProfile, ...doctorDetails, id: userProfile.uid };
};

export const getClinics = async (): Promise<ClinicProfile[]> => {
    const clinicDetailsList = await getCollection<ClinicDetails>('clinics');
    const clinicProfiles = await Promise.all(clinicDetailsList.map(async (details) => {
        const userProfile = await getDocumentById<User>('users', details.userId);
        if (!userProfile) return null;
        return { ...userProfile, ...details, id: userProfile.uid } as ClinicProfile;
    }));
    return clinicProfiles.filter((p): p is ClinicProfile => p !== null);
};

export const getClinicById = async (id: string): Promise<ClinicProfile | undefined> => {
    const userProfile = await getDocumentById<User>('users', id);
    if (!userProfile || userProfile.role !== 'clinic') return undefined;

    const clinicDetails = await getDocumentById<ClinicDetails>('clinics', id);
    if (!clinicDetails) return undefined;

    return { ...userProfile, ...clinicDetails, id: userProfile.uid };
}


// --- APPOINTMENTS ---

export const createAppointment = async (
  patientId: string, 
  doctorId: string, 
  clinicId: string, 
  slot: string,
  type: 'token' | 'video'
): Promise<Appointment> => {
    if (!db) throw new Error("Firestore not initialized");

    const newAppointmentData = {
      patientId,
      doctorId,
      clinicId,
      centreId: null,
      type: type,
      status: 'confirmed',
      scheduledAt: Timestamp.fromDate(new Date()), // This should be improved to take actual date/slot
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "appointments"), newAppointmentData);
    
    return {
        id: docRef.id,
        ...newAppointmentData,
        scheduledAt: newAppointmentData.scheduledAt.toDate().toISOString(),
        createdAt: new Date().toISOString() // Approximate for immediate return
    } as Appointment;
};

// ... other data functions to be refactored ...

// The following are legacy functions that need to be updated or removed.
// They are kept temporarily to avoid breaking the parts of the app that haven't been refactored yet.

export const comprehensiveSpecialties = [
    "General Medicine", "Pediatrics", "Dermatology", "Psychiatry", "Radiology", 
    "General Surgery", "Orthopedics", "Ophthalmology", "ENT", "Obstetrics & Gynecology", 
    "Cardiology", "Neurology", "Nephrology", "Endocrinology", "Gastroenterology"
];

export const searchClinicsAndDoctors = async (queryText: string): Promise<{ clinics: any[], doctors: any[] }> => {
    const [doctors, clinics] = await Promise.all([getDoctors(), getClinics()]);
    
    if (!queryText) {
      return { clinics, doctors };
    }

    const lowerCaseQuery = queryText.toLowerCase();

    const filteredClinics = clinics.filter(clinic =>
        clinic.name.toLowerCase().includes(lowerCaseQuery) ||
        clinic.address.toLowerCase().includes(lowerCaseQuery)
    );

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(lowerCaseQuery) ||
        doctor.specialization.toLowerCase().includes(lowerCaseQuery)
    );

    return { clinics: filteredClinics, doctors: filteredDoctors };
};

export const getAppointmentsForUser = async (patientId: string): Promise<Appointment[]> => {
  if (!db) return [];
  const q = query(
      collection(db, 'appointments'), 
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Appointment);

  return Promise.all(appointments.map(async (app) => {
      if (app.doctorId) {
          app.doctor = await getDoctorById(app.doctorId);
      }
      if (app.clinicId) {
          app.clinic = await getClinicById(app.clinicId);
      }
      app.patient = await getUserProfile(app.patientId) || undefined;
      return convertTimestamps(app);
  }));
};

export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
   if(!db) return undefined;
   const appointment = await getDocumentById<Appointment>('appointments', id);
   if(appointment) {
       if (appointment.doctorId) appointment.doctor = await getDoctorById(appointment.doctorId);
       if (appointment.clinicId) appointment.clinic = await getClinicById(appointment.clinicId);
       if (appointment.patientId) appointment.patient = await getUserProfile(appointment.patientId) || undefined;
   }
   return convertTimestamps(appointment);
};
