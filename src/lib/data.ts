
import type {
  User,
  DoctorProfile,
  DoctorDetails,
  ClinicProfile,
  ClinicDetails,
  Appointment,
  Hospital,
  DiagnosticsCentre,
  TestAppointment,
  DiagnosticTest,
  Pathologist
} from './types';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Role } from '@/app/login/page';
import { Timestamp } from 'firebase/firestore';


// --- MOCK DATA ---

export const mockUsers: User[] = [
  { uid: 'patient-1', name: 'John Patient', email: 'patient@test.com', phone: '123-456-7890', role: 'patient', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doctor-1', name: 'Emily Carter', email: 'emily.carter@test.com', phone: '111-222-3333', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doctor-2', name: 'John Smith', email: 'john.smith@test.com', phone: '444-555-6666', role: 'doctor', verified: false, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'clinic-1', name: 'Sunnyvale Clinic', email: 'clinic@test.com', phone: '987-654-3210', role: 'clinic', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'admin-1', name: 'Admin User', email: 'admin@test.com', phone: '000-000-0000', role: 'admin', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'diag-1', name: 'City Diagnostics', email: 'diag@test.com', phone: '555-444-3333', role: 'diagnostics_centres', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'hospital-1', name: 'Metro General Hospital', email: 'hospital@test.com', phone: '123-123-1234', role: 'hospital', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doctor-test', name: 'Dr. Kushal P. Anand', email: 'doctor@test.com', phone: '8420382000', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },

];

const mockDoctors: DoctorDetails[] = [
  { id: 'doctor-1', userId: 'doctor-1', name: 'Dr. Emily Carter', email: 'emily.carter@test.com', specialization: 'Cardiology', licenseNo: 'DOC-L12345', consultationFee: 800, availability: ["10:00 AM", "11:00 AM", "02:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: 'https://picsum.photos/seed/doc1/150/150', phone: '111-222-3333', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-2', userId: 'doctor-2', name: 'Dr. John Smith', email: 'john.smith@test.com', specialization: 'Dermatology', licenseNo: 'DOC-L67890', consultationFee: 700, availability: ["09:00 AM", "11:30 AM"], clinicId: 'clinic-2', verified: false, imageUrl: 'https://i.pravatar.cc/150?u=doc2', phone: '444-555-6666', clinicName: 'Oakwood Medical' },
  { id: 'doctor-3', userId: 'doctor-3', name: 'Dr. Sarah Lee', email: 'sarah.lee@test.com', specialization: 'Pediatrics', licenseNo: 'DOC-L54321', consultationFee: 600, availability: ["10:00 AM", "01:00 PM", "03:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc3', phone: '777-888-9999', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-test', userId: 'doctor-test', name: 'Dr. Kushal P. Anand', email: 'doctor@test.com', specialization: 'General Practice', licenseNo: 'DOC-TEST', consultationFee: 500, availability: ["09:00 AM", "10:00 AM", "11:00 AM"], clinicId: 'clinic-1', verified: true, imageUrl: '/Doc.jpg', phone: '8420382000', clinicName: 'Sunnyvale Clinic' },
];

const mockClinics: ClinicDetails[] = [
  { id: 'clinic-1', userId: 'clinic-1', name: 'Sunnyvale Clinic', address: '123 Health St, Wellness City', licenseNo: 'CLN-A123', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-1/400/200', doctors: [mockDoctors[0], mockDoctors[2]] },
  { id: 'clinic-2', userId: 'clinic-2', name: 'Oakwood Medical', address: '456 Cure Ave, Remedy Town', licenseNo: 'CLN-B456', verified: false, imageUrl: 'https://picsum.photos/seed/clinic-2/400/200', doctors: [mockDoctors[1]] },
];

const mockAppointments: Appointment[] = [
  { id: 'appt-1', patientId: 'patient-1', doctorId: 'doctor-1', clinicId: 'clinic-1', type: 'clinic', status: 'confirmed', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), patient: mockUsers[0], doctor: mockDoctors[0] as unknown as DoctorProfile, clinic: mockClinics[0] as unknown as ClinicProfile, patientName: 'John Patient', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'appt-2', patientId: 'patient-1', doctorId: 'doctor-3', clinicId: 'clinic-1', type: 'clinic', status: 'completed', scheduledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), patient: mockUsers[0], doctor: mockDoctors[2] as unknown as DoctorProfile, clinic: mockClinics[0] as unknown as ClinicProfile, patientName: 'John Patient', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'appt-3', patientId: 'patient-2', doctorId: 'doctor-1', clinicId: 'clinic-1', type: 'clinic', status: 'confirmed', scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), patientName: 'Jane Doe', doctor: mockDoctors[0] as unknown as DoctorProfile, date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'appt-4', patientId: 'patient-3', doctorId: 'doctor-1', clinicId: 'clinic-1', type: 'video', status: 'confirmed', scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), patientName: 'Peter Pan', doctor: mockDoctors[0] as unknown as DoctorProfile, date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
];

export const comprehensiveTests: DiagnosticTest[] = [
  { id: 'test-1', name: 'Complete Blood Count (CBC)', category: 'Pathology', price: 300 },
  { id: 'test-2', name: 'Lipid Profile', category: 'Pathology', price: 600 },
  { id: 'test-3', name: 'Liver Function Test (LFT)', category: 'Pathology', price: 550 },
  { id: 'test-4', name: 'Kidney Function Test (KFT)', category: 'Pathology', price: 500 },
  { id: 'test-5', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormonal', price: 700 },
  { id: 'test-6', name: 'X-Ray Chest PA View', category: 'Radiology', price: 400 },
  { id: 'test-7', name: 'Ultrasound Abdomen & Pelvis', category: 'Radiology', price: 1200 },
  { id: 'test-8', name: 'ECG', category: 'Cardiology', price: 250 },
  { id: 'test-9', name: 'HbA1c (Glycated Hemoglobin)', category: 'Pathology', price: 450 },
  { id: 'test-10', name: 'Vitamin D, 25-Hydroxy', category: 'Vitamins', price: 1400 },
  { id: 'test-11', name: 'Vitamin B12', category: 'Vitamins', price: 800 },
  { id: 'test-12', name: 'Urine Routine & Microscopy', category: 'Pathology', price: 150 },
];

const mockPathologists: Pathologist[] = [
    { id: 'path-1', name: 'Dr. Alan Grant', qualifications: ['MD Pathology'], imageUrl: 'https://i.pravatar.cc/150?u=path-1'},
    { id: 'path-2', name: 'Dr. Ellie Sattler', qualifications: ['MBBS, DNB'], imageUrl: 'https://i.pravatar.cc/150?u=path-2'},
    { id: 'path-3', name: 'Dr. Ian Malcolm', qualifications: ['MD, FRCPath'], imageUrl: 'https://i.pravatar.cc/150?u=path-3'},
]

const mockDiagnostics: DiagnosticsCentre[] = [
  { id: 'diag-1', name: 'City Diagnostics', location: '789 Test Ave, Lab City', contact: { phone: '555-444-3333', email: 'contact@citydiag.com' }, rating: 4.7, imageUrl: 'https://picsum.photos/seed/diag-1/400/200', dataAiHint: 'laboratory microscope', tests: comprehensiveTests.slice(0,4), pathologists: [mockPathologists[0]] },
  { id: 'diag-2', name: 'Advanced Imaging Center', location: '101 Scan Rd, Picture Town', contact: { phone: '555-555-5555', email: 'info@advancedimaging.com' }, rating: 4.9, imageUrl: 'https://picsum.photos/seed/diag-2/400/200', dataAiHint: 'mri machine', tests: [comprehensiveTests[5], comprehensiveTests[6]], pathologists: [mockPathologists[1]] },
  { id: 'diag-3', name: 'Care Scans & Labs', location: '202 Health Blvd, Wellness City', contact: { phone: '555-666-7777', email: 'support@carescan.com' }, rating: 4.8, imageUrl: 'https://picsum.photos/seed/diag-3/400/200', dataAiHint: 'health clinic', tests: comprehensiveTests, pathologists: [mockPathologists[0], mockPathologists[2]] },
];

const mockHospitals: Hospital[] = [
    { id: 'hosp-1', name: 'Metro General Hospital', location: { address: '1 Hospital Plaza, Metro City' }, contact: '555-111-1111', rating: 4.8, specialties: ['Emergency', 'Cardiology', 'General Surgery'], emergencyAvailable: true, beds: { general: { total: 100, available: 20 }, icu: { total: 20, available: 3 }, ventilator: { total: 10, available: 1 }, oxygen: { total: 50, available: 10 } }, lastUpdated: new Date().toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-1/600/400', dataAiHint: 'hospital building' },
    { id: 'hosp-2', name: 'Hope Childrens Hospital', location: { address: '2 Hope St, Kidville' }, contact: '555-222-2222', rating: 4.9, specialties: ['Pediatrics', 'Maternity', 'Emergency'], emergencyAvailable: true, beds: { general: { total: 50, available: 15 }, icu: { total: 10, available: 5 }, ventilator: { total: 5, available: 2 }, oxygen: { total: 20, available: 8 } }, lastUpdated: new Date(Date.now() - 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-2/600/400', dataAiHint: 'children hospital' },
    { id: 'hosp-3', name: 'HLG Memorial Hospital', location: { address: 'Sen Raliegh Rd, Asansol' }, contact: '08101880088', rating: 4.2, specialties: ['General Medicine', 'Emergency'], emergencyAvailable: true, beds: { general: { total: 75, available: 18 }, icu: { total: 15, available: 2 }, ventilator: { total: 8, available: 1 }, oxygen: { total: 30, available: 12 } }, lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-3/600/400', dataAiHint: 'hospital exterior' },
    { id: 'hosp-4', name: 'Healthworld Hospitals, Asansol', location: { address: 'PW3X+M72, Asansol' }, contact: 'N/A', rating: 4.0, specialties: ['Multispeciality', 'Orthopedics'], emergencyAvailable: true, beds: { general: { total: 120, available: 30 }, icu: { total: 25, available: 5 }, ventilator: { total: 12, available: 3 }, oxygen: { total: 60, available: 22 } }, lastUpdated: new Date(Date.now() - 4 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-4/600/400', dataAiHint: 'modern hospital' },
    { id: 'hosp-5', name: 'BLESS HOSPITAL', location: { address: 'Jyoti Nagar, Shakespeare Sarani, Asansol' }, contact: 'N/A', rating: 4.3, specialties: ['General Surgery', 'Gynaecology'], emergencyAvailable: true, beds: { general: { total: 60, available: 10 }, icu: { total: 10, available: 4 }, ventilator: { total: 5, available: 0 }, oxygen: { total: 25, available: 7 } }, lastUpdated: new Date(Date.now() - 8 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-5/600/400', dataAiHint: 'clinic building' },
    { id: 'hosp-6', name: 'Sharanya Multispeciality Hospital', location: { address: 'Gopalnagar, West Bengal' }, contact: '094756 41904', rating: 4.3, specialties: ['General Hospital'], emergencyAvailable: true, beds: { general: { total: 50, available: 12 }, icu: { total: 8, available: 3 }, ventilator: { total: 4, available: 1 }, oxygen: { total: 20, available: 9 } }, lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-6/600/400', dataAiHint: 'hospital building' },
    { id: 'hosp-7', name: 'Teresa Memorial Hospital', location: { address: 'NH 2, beside Anamoy Superspeciality Hospital' }, contact: '074777 97607', rating: 4.4, specialties: ['Hospital'], emergencyAvailable: true, beds: { general: { total: 65, available: 22 }, icu: { total: 12, available: 5 }, ventilator: { total: 6, available: 2 }, oxygen: { total: 30, available: 15 } }, lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-7/600/400', dataAiHint: 'modern hospital' },
    { id: 'hosp-8', name: 'AHAD MULTISPECIALITY HOSPITAL', location: { address: 'Bardhaman, West Bengal' }, contact: '075869 56333', rating: 4.2, specialties: ['Hospital'], emergencyAvailable: true, beds: { general: { total: 80, available: 15 }, icu: { total: 15, available: 4 }, ventilator: { total: 7, available: 3 }, oxygen: { total: 40, available: 18 } }, lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-8/600/400', dataAiHint: 'hospital exterior' },
];

const mockTestAppointments: TestAppointment[] = [
    { id: 't-appt-1', patientId: 'patient-1', patientName: 'John Patient', centreId: 'diag-1', test: comprehensiveTests[0], date: new Date().toISOString(), time: '10:00 AM', status: 'Report Ready', reportUrl: '#' },
    { id: 't-appt-2', patientId: 'patient-2', patientName: 'Jane Doe', centreId: 'diag-1', test: comprehensiveTests[1], date: new Date().toISOString(), time: '11:00 AM', status: 'Completed' },
    { id: 't-appt-3', patientId: 'patient-3', patientName: 'Peter Pan', centreId: 'diag-3', test: comprehensiveTests[2], date: new Date(Date.now() + 86400000).toISOString(), time: '09:00 AM', status: 'Scheduled' },
    { id: 't-appt-4', patientId: 'patient-1', patientName: 'John Patient', centreId: 'diag-3', test: comprehensiveTests[7], date: new Date(Date.now() + 2 * 86400000).toISOString(), time: '12:00 PM', status: 'Scheduled' },
]

// --- USER MANAGEMENT ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
    console.log(`MOCK: getUserProfile for uid: ${uid}`);
    const user = mockUsers.find(u => u.uid === uid);
    if (user) return Promise.resolve(user);

    // If not in users, check if it's a doctor (special case)
    const doctor = mockDoctors.find(d => d.userId === uid);
    if(doctor) {
        return Promise.resolve({
            uid: doctor.userId,
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone || '',
            role: 'doctor',
            verified: doctor.verified || false,
            createdAt: new Date().toISOString()
        } as User);
    }
    return Promise.resolve(null);
};

export const createUserInFirestore = async (user: FirebaseUser, role: Role, baseData: any, detailsData: any): Promise<any> => {
    console.log("MOCK: createUserInFirestore called. No database action taken.", { user, role, baseData, detailsData });
    // This function will now just simulate a successful creation without writing to any database.
    return Promise.resolve({ ...baseData, ...detailsData });
}

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
    console.log("MOCK: updateUserProfile called. No database action taken.", { uid, data });
    return Promise.resolve();
};

export const updateDoctorProfile = async (uid: string, data: Partial<DoctorDetails>): Promise<void> => {
    console.log("MOCK: updateDoctorProfile called. No database action taken.", { uid, data });
    return Promise.resolve();
};

export const updateUserVerification = async (uid: string, verified: boolean): Promise<void> => {
    console.log("MOCK: updateUserVerification called. No database action taken.", { uid, verified });
    const user = mockUsers.find(u => u.uid === uid);
    if(user) user.verified = verified;
    const doctor = mockDoctors.find(d => d.id === uid);
    if(doctor) doctor.verified = verified;
    return Promise.resolve();
};


// --- DATA FETCHING ---

export const getDoctors = async (): Promise<DoctorDetails[]> => {
    console.log("MOCK: getDoctors called.");
    return Promise.resolve(mockDoctors);
};

export const getDoctorById = async (id: string): Promise<DoctorProfile | undefined> => {
    console.log(`MOCK: getDoctorById for id: ${id}`);
    const doctorDetails = mockDoctors.find(d => d.id === id);
    if (!doctorDetails) return undefined;
    
    // Find the base user info, but don't fail if it's missing (it might be a doctor-only signup)
    const baseUser = mockUsers.find(u => u.uid === id);

    return Promise.resolve({
        ...baseUser, // Spread base user (could be undefined, which is fine)
        uid: id, // Ensure uid is from the doctor's id
        ...doctorDetails // Spread all details from the doctor record
    } as DoctorProfile);
};

export const getClinics = async (): Promise<ClinicDetails[]> => {
    console.log("MOCK: getClinics called.");
    return Promise.resolve(mockClinics);
};

export const getClinicById = async (id: string): Promise<ClinicDetails | undefined> => {
    console.log(`MOCK: getClinicById for id: ${id}`);
    const clinic = mockClinics.find(c => c.id === id);
    if (clinic) {
        // Hydrate doctor details within the clinic
        clinic.doctors = clinic.doctors.map(doc => mockDoctors.find(d => d.id === (doc as any).id) || doc);
    }
    return Promise.resolve(clinic);
};


// --- APPOINTMENTS ---

export const createAppointment = async (
  patientId: string, 
  doctorId: string, 
  clinicId: string, 
  slot: string,
  type: 'clinic' | 'video'
): Promise<Appointment> => {
    console.log("MOCK: createAppointment called.", { patientId, doctorId, clinicId, slot, type });
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientId,
      doctorId,
      clinicId,
      type,
      status: 'confirmed',
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      patientName: 'Mock Patient',
      date: new Date().toISOString()
    };
    mockAppointments.push(newAppointment);
    return Promise.resolve(newAppointment);
};

export const searchClinicsAndDoctors = async (queryText: string): Promise<{ clinics: ClinicDetails[], doctors: DoctorDetails[] }> => {
    console.log(`MOCK: searchClinicsAndDoctors for query: ${queryText}`);
    
    if (!queryText) {
      return Promise.resolve({ clinics: mockClinics, doctors: mockDoctors });
    }

    const lowerCaseQuery = queryText.toLowerCase();

    const filteredClinics = mockClinics.filter(clinic =>
        clinic.name.toLowerCase().includes(lowerCaseQuery) ||
        (clinic.address && clinic.address.toLowerCase().includes(lowerCaseQuery))
    );

    const filteredDoctors = mockDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(lowerCaseQuery) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(lowerCaseQuery))
    );

    return Promise.resolve({ clinics: filteredClinics, doctors: filteredDoctors });
};

export const getAppointmentsForUser = async (patientId: string): Promise<Appointment[]> => {
  console.log(`MOCK: getAppointmentsForUser for patientId: ${patientId}`);
  const appointments = mockAppointments.filter(app => app.patientId === patientId);
  for (const app of appointments) {
      if (app.doctorId && !app.doctor) app.doctor = await getDoctorById(app.doctorId) as DoctorProfile;
      if (app.clinicId && !app.clinic) app.clinic = await getClinicById(app.clinicId) as ClinicProfile;
  }
  return Promise.resolve(appointments);
};

export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
   console.log(`MOCK: getAppointmentById for id: ${id}`);
   const appointment = mockAppointments.find(app => app.id === id);
   if(appointment) {
       if (appointment.doctorId && !appointment.doctor) appointment.doctor = mockDoctors.find(d => d.id === appointment.doctorId) as unknown as DoctorProfile;
       if (appointment.clinicId && !appointment.clinic) appointment.clinic = mockClinics.find(c => c.id === appointment.clinicId) as unknown as ClinicProfile;
       if (appointment.patientId && !appointment.patient) appointment.patient = mockUsers.find(u => u.uid === appointment.patientId);
   }
   return Promise.resolve(appointment);
};

export const getAppointmentsForClinic = async (clinicId: string): Promise<Appointment[]> => {
  console.log(`MOCK: getAppointmentsForClinic for clinicId: ${clinicId}`);
  const appointments = mockAppointments.filter(app => app.clinicId === clinicId);
   for (const app of appointments) {
      if (app.doctorId && !app.doctor) app.doctor = await getDoctorById(app.doctorId) as DoctorProfile;
  }
  return Promise.resolve(appointments);
};

export const getUsers = async (): Promise<User[]> => {
    console.log("MOCK: getUsers called.");
    return Promise.resolve(mockUsers);
}

// --- LEGACY OR MOCK FUNCTIONS ---

export const comprehensiveSpecialties = [
    "General Medicine", "Pediatrics", "Dermatology", "Psychiatry", "Radiology", 
    "General Surgery", "Orthopedics", "Ophthalmology", "ENT", "Obstetrics & Gynecology", 
    "Cardiology", "Neurology", "Nephrology", "Endocrinology", "Gastroenterology"
];

export const comprehensiveHospitalDepartments = [
    'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Gastroenterology', 'General Surgery', 'Radiology', 'Maternity'
];


export const getHospitals = async (): Promise<Hospital[]> => {
    console.log("MOCK: getHospitals called.");
    return Promise.resolve(mockHospitals);
}

export const searchHospitals = async (queryText: string): Promise<Hospital[]> => {
  console.log(`MOCK: searchHospitals for query: ${queryText}`);
  if (!queryText) return Promise.resolve(mockHospitals);
  const lowerCaseQuery = queryText.toLowerCase();
  return Promise.resolve(mockHospitals.filter(h =>
    h.name.toLowerCase().includes(lowerCaseQuery) ||
    h.location.address.toLowerCase().includes(lowerCaseQuery) ||
    h.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery))
  ));
};

export const getDiagnosticsCentres = async (): Promise<DiagnosticsCentre[]> => {
    console.log("MOCK: getDiagnosticsCentres called.");
    return Promise.resolve(mockDiagnostics);
};

export const getDiagnosticsCentreById = async (id: string): Promise<DiagnosticsCentre | undefined> => {
    console.log(`MOCK: getDiagnosticsCentreById for id: ${id}`);
    return Promise.resolve(mockDiagnostics.find(d => d.id === id));
};

export const getTestAppointmentsForCentre = async (centreId: string): Promise<TestAppointment[]> => {
    console.log(`MOCK: getTestAppointmentsForCentre for centreId: ${centreId}`);
    return Promise.resolve(mockTestAppointments.filter(app => app.centreId === centreId));
};


    

    

