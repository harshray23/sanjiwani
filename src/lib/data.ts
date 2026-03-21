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
  RewardActivity,
  Donor
} from './types';

// --- MOCK DATA ---

export const mockUsers: User[] = [
  { uid: 'patient-1', name: 'John Patient', email: 'patient@test.com', phone: '123-456-7890', role: 'patient', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 }, sanjeevaniPoints: 120, walletAddress: '0x82a1...91d', bloodGroup: 'O+', age: 30, dob: '1994-01-01' },
  { uid: 'doctor-1', name: 'Emily Carter', email: 'emily.carter@test.com', phone: '111-222-3333', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'clinic-1', name: 'Sunnyvale Clinic', email: 'clinic@test.com', phone: '987-654-3210', role: 'clinic', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'admin-1', name: 'Admin User', email: 'admin@test.com', phone: '000-000-0000', role: 'admin', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'hospital-1', name: 'Metro General Hospital', email: 'hospital@test.com', phone: '123-123-1234', role: 'hospital', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
];

export const mockHospitals: Hospital[] = [
    { 
      id: 'hosp-1', 
      name: 'Metro General Hospital', 
      location: { address: '1 Hospital Plaza, Metro City', coordinates: { latitude: 28.6139, longitude: 77.2090 } }, 
      contact: '555-111-1111', 
      rating: 4.8, 
      specialties: ['Emergency', 'Cardiology', 'General Surgery'], 
      emergencyAvailable: true, 
      beds: { general: { total: 100, available: 20 }, icu: { total: 20, available: 3 }, ventilator: { total: 10, available: 1 }, oxygen: { total: 50, available: 10 } }, 
      bloodInventory: { 'A+': 12, 'A-': 4, 'B+': 1, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 5, 'AB-': 2 },
      lastUpdated: new Date().toISOString(), 
      imageUrl: '/hos1.jpg', 
      dataAiHint: 'hospital building', 
      onChainVerified: true, 
      lastVerificationHash: '0xabc123...' 
    },
    { 
      id: 'hosp-2', 
      name: 'Hope City Hospital', 
      location: { address: '2 Hope St, South Delhi', coordinates: { latitude: 28.5355, longitude: 77.3910 } }, 
      contact: '555-222-2222', 
      rating: 4.9, 
      specialties: ['Pediatrics', 'Maternity', 'Emergency', 'Hematology'], 
      emergencyAvailable: true, 
      beds: { general: { total: 50, available: 15 }, icu: { total: 10, available: 5 }, ventilator: { total: 5, available: 2 }, oxygen: { total: 20, available: 8 } }, 
      bloodInventory: { 'A+': 8, 'A-': 2, 'B+': 15, 'B-': 5, 'O+': 10, 'O-': 3, 'AB+': 4, 'AB-': 1 },
      lastUpdated: new Date(Date.now() - 3600000).toISOString(), 
      imageUrl: '/hos2.jpg', 
      dataAiHint: 'modern hospital', 
      onChainVerified: true, 
      lastVerificationHash: '0xdef456...' 
    },
];

export const mockDonors: Donor[] = [
  { id: 'd1', name: 'Rahul Sharma', bloodGroup: 'O-', location: { lat: 28.62, lng: 77.21, address: 'Connaught Place' }, available: true, lastDonated: '2024-01-15' },
  { id: 'd2', name: 'Ankit Verma', bloodGroup: 'O+', location: { lat: 28.55, lng: 77.35, address: 'Noida Sector 18' }, available: true, lastDonated: '2024-02-10' },
  { id: 'd3', name: 'Priya Singh', bloodGroup: 'O-', location: { lat: 28.58, lng: 77.25, address: 'Lajpat Nagar' }, available: true, lastDonated: '2023-12-20' },
];

const mockDoctors: DoctorDetails[] = [
  { id: 'doctor-1', userId: 'doctor-1', name: 'Dr. Emily Carter', email: 'emily.carter@test.com', specialization: 'Cardiology', licenseNo: 'DOC-L12345', consultationFee: 800, availability: ["10:00 AM", "11:00 AM", "02:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: '/doctor11.jpg', phone: '111-222-3333', clinicName: 'Sunnyvale Clinic' },
];

const mockClinics: ClinicDetails[] = [
  { id: 'clinic-1', userId: 'clinic-1', name: 'Sunnyvale Clinic', address: '123 Health St, Wellness City', licenseNo: 'CLN-A123', verified: true, imageUrl: '/clinic1.jpg', dataAiHint: 'clinic reception', doctors: [mockDoctors[0]] },
];

const mockAppointments: Appointment[] = [];
const mockMedicalRecords: MedicalRecord[] = [];
const mockRewardActivities: RewardActivity[] = [];

// --- DATA FETCHING & MUTATION ---

export const getMedicalRecords = async (userId: string): Promise<MedicalRecord[]> => {
  return Promise.resolve(mockMedicalRecords.filter(r => r.userId === userId));
};

export const createVerifiedRecord = async (userId: string, record: any, hash: string, txHash: string): Promise<MedicalRecord> => {
  const uniqueId = `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const newRecord: MedicalRecord = { ...record, id: uniqueId, userId, onChainHash: hash, txHash, verified: true, createdAt: new Date().toISOString() };
  mockMedicalRecords.push(newRecord);
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
    mockRewardActivities.unshift({ id: `act-${Date.now()}`, userId, action, points, timestamp: new Date().toISOString(), txHash });
  }
  return Promise.resolve();
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
  return Promise.resolve(mockAppointments.filter(app => app.patientId === patientId).sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
};

export const getClinics = async (): Promise<ClinicDetails[]> => {
  return Promise.resolve(mockClinics);
};

export const getDoctorById = async (id: string): Promise<DoctorProfile | null> => {
  const doc = mockDoctors.find(d => d.id === id || d.userId === id);
  return Promise.resolve(doc as unknown as DoctorProfile || null);
};

export const createAppointment = async (patientId: string, doctorId: string, clinicId: string, slot: string, type: any): Promise<Appointment> => {
    const newAppointment: Appointment = { id: `appt-${Date.now()}`, patientId, doctorId, clinicId, type, status: 'confirmed', scheduledAt: new Date().toISOString(), createdAt: new Date().toISOString(), date: new Date().toISOString(), patientName: 'User' };
    mockAppointments.push(newAppointment);
    return Promise.resolve(newAppointment);
}

export const getAppointmentById = async (id: string): Promise<Appointment | undefined> => {
    return Promise.resolve(mockAppointments.find(a => a.id === id));
}

export const updateAppointmentWithProof = async (id: string, onChainHash: string, txHash: string): Promise<void> => {
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index !== -1) {
        mockAppointments[index].onChainHash = onChainHash;
        mockAppointments[index].txHash = txHash;
    }
}

export const comprehensiveHospitalDepartments = [
    'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Gastroenterology', 'General Surgery', 'Radiology', 'Maternity'
];

export const updateHospitalBloodInventory = async (hospitalId: string, inventory: any) => {
  const hospital = mockHospitals.find(h => h.id === hospitalId);
  if (hospital) {
    hospital.bloodInventory = inventory;
    hospital.lastUpdated = new Date().toISOString();
  }
  return Promise.resolve(hospital);
};

export const getDonorsByGroup = async (bloodGroup: string): Promise<Donor[]> => {
  return Promise.resolve(mockDonors.filter(d => d.bloodGroup === bloodGroup && d.available));
};
