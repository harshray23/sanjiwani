

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

export const getUserProfile = async (uid: string): Promise<User | null> => {
    if (!db) return null;
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return { uid: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
};


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

export const comprehensiveSpecialties = [
    // Clinical Specialties
    "General Medicine", "Pediatrics", "Dermatology", "Psychiatry", "Radiology", 
    "Emergency Medicine", "Nuclear Medicine", "Sports Medicine", "Family Medicine", "Community Medicine",
    // Surgical Specialties
    "General Surgery", "Orthopedics", "Ophthalmology", "ENT", "Obstetrics & Gynecology", 
    "Neurosurgery", "Urology", "Cardiothoracic & Vascular Surgery", "Plastic Surgery", 
    "Pediatric Surgery", "Surgical Oncology",
    // Super-Specialties
    "Cardiology", "Neurology", "Nephrology", "Endocrinology", "Medical Oncology", "Gastroenterology", 
    "Hepatology", "Pulmonary Medicine / Critical Care", "Rheumatology",
    // Non-Clinical Specialties
    "Anatomy", "Physiology", "Biochemistry", "Pharmacology", "Pathology", "Microbiology", "Forensic Medicine"
];

export const comprehensiveHospitalDepartments = [
    "OPD (Outpatient Department)",
    "IPD (Inpatient Department)",
    "Emergency / Casualty",
    "ICU (Intensive Care Unit)",
    "NICU (Neonatal Intensive Care Unit)",
    "PICU (Pediatric Intensive Care Unit)",
    "Operation Theatre (OT)",
    "Radiology / Imaging",
    "Pathology & Laboratory Services",
    "Pharmacy",
    "Blood Bank",
    "Dialysis Unit",
    "Maternity & Labor Room",
    "Pediatrics Department",
    "Orthopedics Department",
    "Cardiology Department",
    "Neurology Department",
    "Oncology Department",
    "Dermatology Department",
    "ENT Department",
    "Ophthalmology Department",
    "Psychiatry Department",
    "Physiotherapy & Rehabilitation",
    "Dental Department",
    "Dietary & Nutrition Department",
    "Administration / Billing / Records",
    "Housekeeping & Maintenance",
    "Ambulance & Transport Services",
];

export const getClinics = async (): Promise<Clinic[]> => {
    const clinics = await getCollection<Clinic>('clinics');
    // Assign a varied set of specialties to each hospital for better filtering demo
    return clinics.map((clinic, index) => ({
      ...clinic,
      specialties: comprehensiveSpecialties.slice(index % 5, (index % 5) + Math.floor(Math.random() * 5) + 3)
    }));
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
    const doctors = await getCollection<Doctor>('doctors');
    return doctors.map((doc, index) => ({
        ...doc,
        specialty: comprehensiveSpecialties[index % comprehensiveSpecialties.length]
    }))
};

export const getDoctorById = async (id: string): Promise<Doctor | undefined> => {
    return getDocumentById<Doctor>('doctors', id);
};

export const searchClinicsAndDoctors = async (queryText: string): Promise<{ clinics: Clinic[], doctors: Doctor[] }> => {
    if (!db) {
        console.error("Firestore not initialized");
        return { clinics: [], doctors: [] };
    }
    
    const [allClinics, allDoctors] = await Promise.all([getClinics(), getDoctors()]);
    
    if (!queryText) {
      return { clinics: allClinics, doctors: allDoctors };
    }

    const lowerCaseQuery = queryText.toLowerCase();

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
    // Assign a varied set of specialties to each hospital for better filtering demo
    return hospitals.map((hospital, index) => ({
      ...hospital,
      specialties: comprehensiveHospitalDepartments.slice(index % 5, (index % 5) + Math.floor(Math.random() * 8) + 5)
    }));
};

export const searchHospitals = async (queryText: string): Promise<Hospital[]> => {
    if (!db) return [];
    const allHospitals = await getHospitals();
    if (!queryText) {
        return allHospitals;
    }
    const lowerCaseQuery = queryText.toLowerCase();
    
    return allHospitals.filter(hospital => 
        hospital.name.toLowerCase().includes(lowerCaseQuery) || 
        hospital.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery)) ||
        hospital.location.address.toLowerCase().includes(lowerCaseQuery)
    );
};

export const comprehensiveTests: DiagnosticTest[] = [
  // Blood Tests
  { id: 'test-cbc', name: 'Complete Blood Count (CBC)', price: 300, category: 'Blood Tests' },
  { id: 'test-glucose', name: 'Blood Glucose (Fasting, PP, HbA1c)', price: 500, category: 'Blood Tests' },
  { id: 'test-lipid', name: 'Lipid Profile', price: 800, category: 'Blood Tests' },
  { id: 'test-lft', name: 'Liver Function Test (LFT)', price: 750, category: 'Blood Tests' },
  { id: 'test-kft', name: 'Kidney Function Test (KFT)', price: 750, category: 'Blood Tests' },
  { id: 'test-thyroid', name: 'Thyroid Function Test (T3, T4, TSH)', price: 600, category: 'Blood Tests' },
  { id: 'test-cardiac-markers', name: 'Cardiac Markers (Troponin, CK-MB)', price: 1200, category: 'Blood Tests' },
  { id: 'test-electrolytes', name: 'Electrolytes (Na, K, Ca, Mg, Cl)', price: 400, category: 'Blood Tests' },
  { id: 'test-vitamins', name: 'Vitamin Tests (D, B12)', price: 1500, category: 'Blood Tests' },
  { id: 'test-esr', name: 'ESR (Erythrocyte Sedimentation Rate)', price: 200, category: 'Blood Tests' },
  { id: 'test-coag', name: 'Coagulation Profile (PT, INR, aPTT)', price: 900, category: 'Blood Tests' },
  { id: 'test-blood-culture', name: 'Blood Culture', price: 1000, category: 'Blood Tests' },
  // Urine & Stool Tests
  { id: 'test-urine-rm', name: 'Urine Routine & Microscopy', price: 250, category: 'Urine & Stool Tests' },
  { id: 'test-urine-culture', name: 'Urine Culture', price: 800, category: 'Urine & Stool Tests' },
  { id: 'test-24h-urine-protein', name: '24-Hour Urine Protein', price: 600, category: 'Urine & Stool Tests' },
  { id: 'test-stool-rm', name: 'Stool Routine & Microscopy', price: 250, category: 'Urine & Stool Tests' },
  { id: 'test-stool-culture', name: 'Stool Culture', price: 700, category: 'Urine & Stool Tests' },
  { id: 'test-occult-blood', name: 'Occult Blood Test', price: 400, category: 'Urine & Stool Tests' },
  // Cardiac & Vascular Tests
  { id: 'test-ecg', name: 'Electrocardiogram (ECG/EKG)', price: 350, category: 'Cardiac & Vascular Tests' },
  { id: 'test-echo', name: 'Echocardiogram (ECHO)', price: 2500, category: 'Cardiac & Vascular Tests' },
  { id: 'test-tmt', name: 'Treadmill Test (TMT)', price: 2000, category: 'Cardiac & Vascular Tests' },
  { id: 'test-holter', name: 'Holter Monitoring', price: 3000, category: 'Cardiac & Vascular Tests' },
  { id: 'test-cardiac-ct-mri', name: 'Cardiac CT/MRI', price: 10000, category: 'Cardiac & Vascular Tests' },
  { id: 'test-angiography', name: 'Angiography', price: 15000, category: 'Cardiac & Vascular Tests' },
  { id: 'test-doppler-usg', name: 'Doppler Ultrasound', price: 1800, category: 'Cardiac & Vascular Tests' },
  // Neurological Tests
  { id: 'test-eeg', name: 'Electroencephalogram (EEG)', price: 2000, category: 'Neurological Tests' },
  { id: 'test-emg', name: 'Electromyography (EMG)', price: 3000, category: 'Neurological Tests' },
  { id: 'test-nerve-conduction', name: 'Nerve Conduction Study', price: 3500, category: 'Neurological Tests' },
  { id: 'test-ct-brain', name: 'CT Brain', price: 2500, category: 'Neurological Tests' },
  { id: 'test-mri-brain', name: 'MRI Brain', price: 8000, category: 'Neurological Tests' },
  { id: 'test-lumbar-puncture', name: 'Lumbar Puncture (CSF Analysis)', price: 4000, category: 'Neurological Tests' },
  // Respiratory Tests
  { id: 'test-xray-chest', name: 'Chest X-Ray', price: 500, category: 'Respiratory Tests' },
  { id: 'test-pft', name: 'Pulmonary Function Test (PFT)', price: 1500, category: 'Respiratory Tests' },
  { id: 'test-ct-chest', name: 'CT Chest (HRCT)', price: 5000, category: 'Respiratory Tests' },
  { id: 'test-abg', name: 'Arterial Blood Gas (ABG)', price: 1200, category: 'Respiratory Tests' },
  { id: 'test-bronchoscopy', name: 'Bronchoscopy', price: 7000, category: 'Respiratory Tests' },
  { id: 'test-tb', name: 'Tuberculosis Test (Mantoux, GeneXpert)', price: 2000, category: 'Respiratory Tests' },
  // Imaging & Radiology
  { id: 'test-xray', name: 'X-Ray', price: 400, category: 'Imaging & Radiology' },
  { id: 'test-usg', name: 'Ultrasound (USG)', price: 1200, category: 'Imaging & Radiology' },
  { id: 'test-ct-scan', name: 'CT Scan', price: 5000, category: 'Imaging & Radiology' },
  { id: 'test-mri-scan', name: 'MRI Scan', price: 8000, category: 'Imaging & Radiology' },
  { id: 'test-pet-scan', name: 'PET Scan', price: 25000, category: 'Imaging & Radiology' },
  { id: 'test-mammography', name: 'Mammography', price: 1800, category: 'Imaging & Radiology' },
  { id: 'test-dexa-scan', name: 'Bone Densitometry (DEXA)', price: 2200, category: 'Imaging & Radiology' },
  // Infectious Disease Tests
  { id: 'test-covid', name: 'COVID-19 Test (RT-PCR)', price: 500, category: 'Infectious Disease Tests' },
  { id: 'test-hiv', name: 'HIV Test', price: 600, category: 'Infectious Disease Tests' },
  { id: 'test-hepatitis', name: 'Hepatitis Panel', price: 1200, category: 'Infectious Disease Tests' },
  { id: 'test-dengue', name: 'Dengue Test', price: 800, category: 'Infectious Disease Tests' },
  { id: 'test-malaria', name: 'Malaria Test', price: 400, category: 'Infectious Disease Tests' },
  { id: 'test-typhoid', name: 'Typhoid Test (Widal, Typhidot)', price: 500, category: 'Infectious Disease Tests' },
  { id: 'test-syphilis', name: 'Syphilis Test (VDRL)', price: 450, category: 'Infectious Disease Tests' },
  // Pathology / Biopsy
  { id: 'test-fnac', name: 'FNAC (Fine Needle Aspiration Cytology)', price: 1500, category: 'Pathology / Biopsy' },
  { id: 'test-biopsy', name: 'Tissue Biopsy', price: 3000, category: 'Pathology / Biopsy' },
  { id: 'test-pap-smear', name: 'Pap Smear (Cervical Screening)', price: 900, category: 'Pathology / Biopsy' },
  { id: 'test-bone-marrow', name: 'Bone Marrow Aspiration & Biopsy', price: 5000, category: 'Pathology / Biopsy' },
  // Orthopedic / Bone Tests
  { id: 'test-xray-bone', name: 'X-Ray Bones & Joints', price: 500, category: 'Orthopedic / Bone Tests' },
  { id: 'test-mri-joint', name: 'CT/MRI of Spine & Joints', price: 7000, category: 'Orthopedic / Bone Tests' },
  { id: 'test-bone-scan', name: 'Bone Scan', price: 6000, category: 'Orthopedic / Bone Tests' },
  // Specialized Diagnostic Tests
  { id: 'test-endoscopy', name: 'Endoscopy (Upper GI)', price: 4000, category: 'Specialized Diagnostic Tests' },
  { id: 'test-colonoscopy', name: 'Colonoscopy', price: 6000, category: 'Specialized Diagnostic Tests' },
  { id: 'test-laparoscopy', name: 'Laparoscopy (Diagnostic)', price: 20000, category: 'Specialized Diagnostic Tests' },
  { id: 'test-hysteroscopy', name: 'Hysteroscopy', price: 10000, category: 'Specialized Diagnostic Tests' },
  { id: 'test-psa', name: 'PSA (Prostate Specific Antigen)', price: 900, category: 'Specialized Diagnostic Tests' },
  { id: 'test-cancer-markers', name: 'Cancer Markers (CA-125, CEA)', price: 2500, category: 'Specialized Diagnostic Tests' },
  { id: 'test-allergy', name: 'Allergy Testing', price: 4000, category: 'Specialized Diagnostic Tests' },
  { id: 'test-genetic', name: 'Genetic Testing (Karyotyping)', price: 8000, category: 'Specialized Diagnostic Tests' },
];

export const getDiagnosticsCentres = async (): Promise<DiagnosticsCentre[]> => {
    if(!db) return [];
    const centres = await getCollection<DiagnosticsCentre>('diagnostics');
    
    // Instead of fetching from subcollection, we assign from the comprehensive list
    return centres.map((centre, index) => {
        // Give each centre a variety of tests
        const startIndex = index * 5 % comprehensiveTests.length;
        const numTests = 10 + (index % 15); // Each center gets between 10 and 25 tests
        const assignedTests: DiagnosticTest[] = [];
        for (let i = 0; i < numTests; i++) {
            assignedTests.push(comprehensiveTests[(startIndex + i) % comprehensiveTests.length]);
        }
        centre.tests = assignedTests;
        
        // This part can remain if pathologists are still in a subcollection or can be mocked too
        // For now, let's assume it might still be fetched or it's mocked elsewhere.
        // centre.pathologists = await getCollection<Pathologist>(`diagnostics/${centre.id}/pathologists`);
        
        return centre;
    });
};


export const getDiagnosticsCentreById = async (id: string): Promise<DiagnosticsCentre | undefined> => {
    if (!db) return undefined;
    const centre = await getDocumentById<DiagnosticsCentre>('diagnostics', id);
    if(centre) {
        // Replace subcollection fetch with mock data assignment for consistency
        const allCentresWithMockTests = await getDiagnosticsCentres();
        const matchedCentre = allCentresWithMockTests.find(c => c.id === id);
        if (matchedCentre) {
            centre.tests = matchedCentre.tests;
        } else {
            centre.tests = []; // Default to empty if not found
        }
        
        // You might want to mock pathologists here as well if needed
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

    
