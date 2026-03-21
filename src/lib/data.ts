
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
  Pathologist,
  MedicalRecord,
  RewardActivity
} from './types';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Role } from '@/app/login/page';
import { Timestamp } from 'firebase/firestore';


// --- MOCK DATA ---

export const mockUsers: User[] = [
  { uid: 'patient-1', name: 'John Patient', email: 'patient@test.com', phone: '123-456-7890', role: 'patient', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 }, sanjeevaniPoints: 120, walletAddress: '0x82a1...91d' },
  { uid: 'doctor-1', name: 'Emily Carter', email: 'emily.carter@test.com', phone: '111-222-3333', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doctor-2', name: 'John Smith', email: 'john.smith@test.com', phone: '444-555-6666', role: 'doctor', verified: false, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'clinic-1', name: 'Sunnyvale Clinic', email: 'clinic@test.com', phone: '987-654-3210', role: 'clinic', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'admin-1', name: 'Admin User', email: 'admin@test.com', phone: '000-000-0000', role: 'admin', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'diag-1', name: 'City Diagnostics', email: 'diag@test.com', phone: '555-444-3333', role: 'diagnostics_centres', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'hospital-1', name: 'Metro General Hospital', email: 'hospital@test.com', phone: '123-123-1234', role: 'hospital', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doctor-test', name: 'Dr. Kushal P. Anand', email: 'doctor@test.com', phone: '8420382000', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
];

const mockDoctors: DoctorDetails[] = [
  { id: 'doctor-1', userId: 'doctor-1', name: 'Dr. Emily Carter', email: 'emily.carter@test.com', specialization: 'Cardiology', licenseNo: 'DOC-L12345', consultationFee: 800, availability: ["10:00 AM", "11:00 AM", "02:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: '/doctor11.jpg', phone: '111-222-3333', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-2', userId: 'doctor-2', name: 'Dr. John Smith', email: 'john.smith@test.com', specialization: 'Dermatology', licenseNo: 'DOC-L67890', consultationFee: 700, availability: ["09:00 AM", "11:30 AM"], clinicId: 'clinic-2', verified: false, imageUrl: '/doctor4.jpg', phone: '444-555-6666', clinicName: 'Oakwood Medical' },
  { id: 'doctor-3', userId: 'doctor-3', name: 'Dr. Sarah Lee', email: 'sarah.lee@test.com', specialization: 'Pediatrics', licenseNo: 'DOC-L54321', consultationFee: 1, availability: ["10:00 AM", "01:00 PM", "03:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: '/doctor10.jpg', phone: '777-888-9999', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-test', userId: 'doctor-test', name: 'Dr. Kushal P. Anand', email: 'doctor@test.com', specialization: 'General Practice', licenseNo: 'DOC-TEST', consultationFee: 500, availability: ["09:00 AM", "10:00 AM", "11:00 AM"], clinicId: 'clinic-1', verified: true, imageUrl: '/Doc.jpg', phone: '8420382000', clinicName: 'Sunnyvale Clinic' },
];

const mockClinics: ClinicDetails[] = [
  { id: 'clinic-1', userId: 'clinic-1', name: 'Sunnyvale Clinic', address: '123 Health St, Wellness City', licenseNo: 'CLN-A123', verified: true, imageUrl: '/clinic1.jpg', dataAiHint: 'clinic reception', doctors: [mockDoctors[0], mockDoctors[2], mockDoctors[3]] },
  { id: 'clinic-2', userId: 'clinic-2', name: 'Oakwood Medical', address: '456 Cure Ave, Remedy Town', licenseNo: 'CLN-B456', verified: false, imageUrl: '/clinic2.jpg', dataAiHint: 'medical building', doctors: [mockDoctors[1]] },
];

const mockAppointments: Appointment[] = [
  { id: 'appt-1', patientId: 'patient-1', doctorId: 'doctor-1', clinicId: 'clinic-1', type: 'clinic', status: 'confirmed', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString(), patient: mockUsers[0], doctor: mockDoctors[0] as unknown as DoctorProfile, clinic: mockClinics[0] as unknown as ClinicProfile, patientName: 'John Patient', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const mockHospitals: Hospital[] = [
    { id: 'hosp-1', name: 'Metro General Hospital', location: { address: '1 Hospital Plaza, Metro City' }, contact: '555-111-1111', rating: 4.8, specialties: ['Emergency', 'Cardiology', 'General Surgery'], emergencyAvailable: true, beds: { general: { total: 100, available: 20 }, icu: { total: 20, available: 3 }, ventilator: { total: 10, available: 1 }, oxygen: { total: 50, available: 10 } }, lastUpdated: new Date().toISOString(), imageUrl: '/hos1.jpg', dataAiHint: 'hospital building', onChainVerified: true, lastVerificationHash: '0xabc123...' },
    { id: 'hosp-2', name: 'Hope Childrens Hospital', location: { address: '2 Hope St, Kidville' }, contact: '555-222-2222', rating: 4.9, specialties: ['Pediatrics', 'Maternity', 'Emergency'], emergencyAvailable: true, beds: { general: { total: 50, available: 15 }, icu: { total: 10, available: 5 }, ventilator: { total: 5, available: 2 }, oxygen: { total: 20, available: 8 } }, lastUpdated: new Date(Date.now() - 3600000).toISOString(), imageUrl: '/hos2.jpg', dataAiHint: 'children hospital', onChainVerified: true, lastVerificationHash: '0xdef456...' },
];

const mockMedicalRecords: MedicalRecord[] = [
  { id: 'rec-1', userId: 'patient-1', patientName: 'John Patient', age: 30, hospitalName: 'Metro General', testType: 'Blood Test', testDate: '2024-03-10', fileUrl: '#', onChainHash: '0x83af...21bc', txHash: '0xabc...', verified: true, createdAt: new Date().toISOString() }
];

const mockRewardActivities: RewardActivity[] = [
  { id: 'act-1', userId: 'patient-1', action: 'Blood Donation', points: 50, timestamp: '2024-03-01', txHash: '0xrew1' },
  { id: 'act-2', userId: 'patient-1', action: 'Hospital Update', points: 15, timestamp: '2024-03-05', txHash: '0xrew2' },
  { id: 'act-3', userId: 'patient-1', action: 'Record Upload', points: 10, timestamp: '2024-03-10', txHash: '0xrew3' },
];

// --- DATA FETCHING & MUTATION ---

export const getMedicalRecords = async (userId: string): Promise<MedicalRecord[]> => {
  return Promise.resolve(mockMedicalRecords.filter(r => r.userId === userId));
};

export const createVerifiedRecord = async (userId: string, record: Omit<MedicalRecord, 'id' | 'userId' | 'onChainHash' | 'txHash' | 'verified' | 'createdAt'>, hash: string, txHash: string): Promise<MedicalRecord> => {
  const newRecord: MedicalRecord = {
    ...record,
    id: `rec-${Date.now()}`,
    userId,
    onChainHash: hash,
    txHash,
    verified: true,
    createdAt: new Date().toISOString()
  };
  mockMedicalRecords.push(newRecord);
  // Add reward for record upload
  await rewardUser(userId, 'Record Upload', 10, txHash);
  return Promise.resolve(newRecord);
};

export const getRewards = async (userId: string): Promise<{ points: number, history: RewardActivity[] }> => {
  const history = mockRewardActivities.filter(a => a.userId === userId);
  const points = history.reduce((acc, curr) => acc + curr.points, 0);
  return Promise.resolve({ points, history });
};

export const rewardUser = async (userId: string, action: RewardActivity['action'], points: number, txHash?: string): Promise<void> => {
  const user = mockUsers.find(u => u.uid === userId);
  if (user) {
    user.sanjeevaniPoints = (user.sanjeevaniPoints || 0) + points;
    mockRewardActivities.unshift({
      id: `act-${Date.now()}`,
      userId,
      action,
      points,
      timestamp: new Date().toISOString(),
      txHash
    });
  }
  return Promise.resolve();
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const user = mockUsers.find(u => u.uid === uid);
    if (user) return Promise.resolve(user);
    return Promise.resolve(null);
};

export const getHospitals = async (): Promise<Hospital[]> => {
    return Promise.resolve(mockHospitals);
}

export const getHospitalById = async (id: string): Promise<Hospital | undefined> => {
  return Promise.resolve(mockHospitals.find(h => h.id === id));
};

export const searchHospitals = async (queryText: string): Promise<Hospital[]> => {
  if (!queryText) return Promise.resolve(mockHospitals);
  const lowerCaseQuery = queryText.toLowerCase();
  return Promise.resolve(mockHospitals.filter(h =>
    h.name.toLowerCase().includes(lowerCaseQuery) ||
    h.location.address.toLowerCase().includes(lowerCaseQuery) ||
    h.specialties.some(s => s.toLowerCase().includes(lowerCaseQuery))
  ));
};

export const getAppointmentsForUser = async (patientId: string): Promise<Appointment[]> => {
  const consultations = mockAppointments.filter(app => app.patientId === patientId);
  return Promise.resolve(consultations.sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
};

export const createBedReservation = async (userId: string, hospitalId: string, bedType: string, patientName: string): Promise<Appointment> => {
    const hospital = mockHospitals.find(h => h.id === hospitalId);
    const newAppointment: Appointment = {
        id: `bed-${Date.now()}`,
        patientId: userId,
        patientName: patientName,
        hospitalId: hospitalId,
        type: 'bed',
        status: 'confirmed',
        bedType: bedType,
        scheduledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
        hospital: hospital
    };
    mockAppointments.push(newAppointment);
    return Promise.resolve(newAppointment);
}

export const getUsers = async (): Promise<User[]> => {
    return Promise.resolve(mockUsers);
}

export const comprehensiveHospitalDepartments = [
    'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Gastroenterology', 'General Surgery', 'Radiology', 'Maternity'
];

export const getClinicById = async (id: string): Promise<ClinicDetails | undefined> => {
  return Promise.resolve(mockClinics.find(c => c.id === id));
};

export const getClinics = async (): Promise<ClinicDetails[]> => {
  return Promise.resolve(mockClinics);
};

export const getDoctorById = async (id: string): Promise<DoctorProfile | null> => {
  const doc = mockDoctors.find(d => d.id === id || d.userId === id);
  if (!doc) return Promise.resolve(null);
  return Promise.resolve(doc as unknown as DoctorProfile);
};

export const getDoctors = async (): Promise<DoctorDetails[]> => {
  return Promise.resolve(mockDoctors);
};

export const searchClinicsAndDoctors = async (queryText: string) => {
  const lowerCaseQuery = queryText.toLowerCase();
  const doctors = mockDoctors.filter(d => 
    d.name.toLowerCase().includes(lowerCaseQuery) || 
    d.specialization.toLowerCase().includes(lowerCaseQuery)
  );
  const clinics = mockClinics.filter(c => 
    c.name.toLowerCase().includes(lowerCaseQuery) || 
    c.address.toLowerCase().includes(lowerCaseQuery)
  );
  return { doctors, clinics };
};

export const createAppointment = async (patientId: string, doctorId: string, clinicId: string, slot: string, type: 'clinic' | 'video'): Promise<Appointment> => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    const clinic = mockClinics.find(c => c.id === clinicId);
    const patient = mockUsers.find(u => u.uid === patientId);

    const newAppointment: Appointment = {
        id: `appt-${Date.now()}`,
        patientId,
        doctorId,
        clinicId,
        type,
        status: 'confirmed',
        scheduledAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        date: new Date().toISOString(),
        patient: patient,
        doctor: doctor as unknown as DoctorProfile,
        clinic: clinic as unknown as ClinicProfile,
        patientName: patient?.name || 'Unknown'
    };
    mockAppointments.push(newAppointment);
    return Promise.resolve(newAppointment);
}

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const index = mockUsers.findIndex(u => u.uid === uid);
    if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data };
    }
    return Promise.resolve();
}

export const updateDoctorProfile = async (uid: string, data: any) => {
    const index = mockDoctors.findIndex(d => d.userId === uid);
    if (index !== -1) {
        mockDoctors[index] = { ...mockDoctors[index], ...data };
    }
    return Promise.resolve();
}

export const updateUserVerification = async (uid: string, verified: boolean) => {
    const index = mockUsers.findIndex(u => u.uid === uid);
    if (index !== -1) {
        mockUsers[index].verified = verified;
    }
    return Promise.resolve();
}

// Diagnostics Centres Mock Data
const mockDiagnosticsCentres: DiagnosticsCentre[] = [
    {
        id: 'diag-1',
        name: 'City Diagnostics & Imaging',
        location: 'Wellness City, Sector 4',
        contact: { phone: '555-444-3333', email: 'info@citydiag.com' },
        rating: 4.7,
        imageUrl: '/diag1.jpg',
        dataAiHint: 'diagnostic lab',
        tests: [
            { id: 'test-1', name: 'Full Body Checkup', price: 2500, category: 'Health Packages' },
            { id: 'test-2', name: 'COVID-19 RT-PCR', price: 800, category: 'Microbiology' },
            { id: 'test-3', name: 'Lipid Profile', price: 600, category: 'Biochemistry' },
        ],
        pathologists: [
            { id: 'path-1', name: 'Dr. Anita Desai', qualifications: ['MD Pathology'], imageUrl: 'https://i.pravatar.cc/150?u=path1' }
        ]
    },
    {
        id: 'diag-2',
        name: 'Prime Scan Centre',
        location: 'Remedy Town, Main Road',
        contact: { phone: '555-111-2222', email: 'booking@primescan.com' },
        rating: 4.5,
        imageUrl: '/diag2.jpg',
        dataAiHint: 'mri scan room',
        tests: [
            { id: 'test-4', name: 'MRI Brain', price: 5000, category: 'Radiology' },
            { id: 'test-5', name: 'Chest X-Ray', price: 500, category: 'Radiology' },
        ],
        pathologists: [
            { id: 'path-2', name: 'Dr. Samuel K.', qualifications: ['MD Radiology'], imageUrl: 'https://i.pravatar.cc/150?u=path2' }
        ]
    }
];

export const getDiagnosticsCentres = async (): Promise<DiagnosticsCentre[]> => {
    return Promise.resolve(mockDiagnosticsCentres);
}

export const getDiagnosticsCentreById = async (id: string): Promise<DiagnosticsCentre | undefined> => {
    return Promise.resolve(mockDiagnosticsCentres.find(c => c.id === id));
}

export const getTestById = async (id: string): Promise<DiagnosticTest | undefined> => {
    for (const centre of mockDiagnosticsCentres) {
        const test = centre.tests.find(t => t.id === id);
        if (test) return test;
    }
    return undefined;
}

const mockTestAppointments: TestAppointment[] = [];

export const createTestAppointment = async (patientId: string, centreId: string, testId: string): Promise<TestAppointment> => {
    const centre = mockDiagnosticsCentres.find(c => c.id === centreId);
    const test = centre?.tests.find(t => t.id === testId);
    const patient = mockUsers.find(u => u.uid === patientId);

    const newAppt: TestAppointment = {
        id: `test-appt-${Date.now()}`,
        patientId,
        patientName: patient?.name || 'Unknown',
        centreId,
        test: test!,
        date: new Date().toISOString(),
        time: '10:00 AM',
        status: 'Scheduled'
    };
    mockTestAppointments.push(newAppt);
    
    // Also push to unified appointments
    mockAppointments.push({
        id: newAppt.id,
        patientId,
        patientName: newAppt.patientName,
        centreId,
        type: 'test',
        testName: test!.name,
        status: 'confirmed',
        scheduledAt: newAppt.date,
        createdAt: new Date().toISOString(),
        date: newAppt.date,
        centre: centre
    });

    return Promise.resolve(newAppt);
}

export const getTestAppointmentById = async (id: string): Promise<TestAppointment | undefined> => {
    return Promise.resolve(mockTestAppointments.find(a => a.id === id));
}

export const getTestAppointmentsForCentre = async (centreId: string): Promise<TestAppointment[]> => {
    return Promise.resolve(mockTestAppointments.filter(a => a.centreId === centreId));
}

export const getAppointmentsForClinic = async (clinicId: string): Promise<Appointment[]> => {
    return Promise.resolve(mockAppointments.filter(a => a.clinicId === clinicId));
}

export const getDiagnosticsCentresByTest = async (testName: string): Promise<DiagnosticsCentre[]> => {
    return Promise.resolve(mockDiagnosticsCentres.filter(c => c.tests.some(t => t.name.toLowerCase().includes(testName.toLowerCase()))));
}

export const comprehensiveTests: DiagnosticTest[] = [
    { id: 'test-1', name: 'Full Body Checkup', price: 2500, category: 'Health Packages' },
    { id: 'test-2', name: 'COVID-19 RT-PCR', price: 800, category: 'Microbiology' },
    { id: 'test-3', name: 'Lipid Profile', price: 600, category: 'Biochemistry' },
    { id: 'test-4', name: 'MRI Brain', price: 5000, category: 'Radiology' },
    { id: 'test-5', name: 'Chest X-Ray', price: 500, category: 'Radiology' },
    { id: 'test-6', name: 'Diabetes Screening', price: 400, category: 'Biochemistry' },
    { id: 'test-7', name: 'CBC (Blood Count)', price: 300, category: 'Hematology' }
];
