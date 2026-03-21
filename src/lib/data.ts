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
  Donor,
  AyurvedaRecommendation
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
      imageUrl: 'https://picsum.photos/seed/hosp1/600/400', 
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
      imageUrl: 'https://picsum.photos/seed/hosp2/600/400', 
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

export const comprehensiveTests: DiagnosticTest[] = [
  { id: 't1', name: 'Complete Blood Count (CBC)', price: 500, category: 'Hematology' },
  { id: 't2', name: 'Lipid Profile', price: 800, category: 'Biochemistry' },
  { id: 't3', name: 'HbA1c', price: 600, category: 'Diabetology' },
  { id: 't4', name: 'Liver Function Test (LFT)', price: 1200, category: 'Biochemistry' },
  { id: 't5', name: 'Thyroid Profile (T3, T4, TSH)', price: 900, category: 'Endocrinology' },
];

const mockDoctors: DoctorDetails[] = [
  { id: 'doctor-1', userId: 'doctor-1', name: 'Dr. Emily Carter', email: 'emily.carter@test.com', specialization: 'Cardiology', licenseNo: 'DOC-L12345', consultationFee: 800, availability: ["10:00 AM", "11:00 AM", "02:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doctor1', phone: '111-222-3333', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-2', userId: 'doctor-2', name: 'Dr. James Wilson', email: 'james.wilson@test.com', specialization: 'Pediatrics', licenseNo: 'DOC-L67890', consultationFee: 600, availability: ["09:00 AM", "12:00 PM", "04:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doctor2', phone: '222-333-4444', clinicName: 'Sunnyvale Clinic' },
];

const mockClinics: ClinicDetails[] = [
  { id: 'clinic-1', userId: 'clinic-1', name: 'Sunnyvale Clinic', address: '123 Health St, Wellness City', licenseNo: 'CLN-A123', verified: true, imageUrl: 'https://picsum.photos/seed/clinic1/400/200', dataAiHint: 'clinic reception', doctors: [mockDoctors[0], mockDoctors[1]] },
];

const mockDiagnosticsCentres: DiagnosticsCentre[] = [
  { id: 'dc-1', name: 'Precision Diagnostics', location: '45 Lab Road, Metro City', contact: { phone: '111-222-3333', email: 'info@precision.com' }, rating: 4.7, imageUrl: 'https://picsum.photos/seed/lab1/400/200', dataAiHint: 'laboratory', tests: comprehensiveTests, pathologists: [] },
];

const mockAppointments: Appointment[] = [];
const mockMedicalRecords: MedicalRecord[] = [];
const mockRewardActivities: RewardActivity[] = [];
const mockTestAppointments: TestAppointment[] = [];

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

export const getClinicById = async (id: string): Promise<ClinicProfile | null> => {
  const clinic = mockClinics.find(c => c.id === id);
  if (!clinic) return null;
  return { ...clinic, uid: clinic.userId, email: 'clinic@test.com', phone: '123456789', role: 'clinic' } as unknown as ClinicProfile;
};

export const getDoctorById = async (id: string): Promise<DoctorProfile | null> => {
  const doc = mockDoctors.find(d => d.id === id || d.userId === id);
  if (!doc) return null;
  return { ...doc, uid: doc.userId, role: 'doctor' } as unknown as DoctorProfile;
};

export const searchClinicsAndDoctors = async (queryText: string): Promise<{ clinics: ClinicDetails[], doctors: DoctorDetails[] }> => {
  const lowerCaseQuery = queryText.toLowerCase();
  if (!lowerCaseQuery) return { clinics: mockClinics, doctors: mockDoctors };
  
  const filteredClinics = mockClinics.filter(c => c.name.toLowerCase().includes(lowerCaseQuery) || c.address.toLowerCase().includes(lowerCaseQuery));
  const filteredDoctors = mockDoctors.filter(d => d.name.toLowerCase().includes(lowerCaseQuery) || d.specialization.toLowerCase().includes(lowerCaseQuery));
  
  return { clinics: filteredClinics, doctors: filteredDoctors };
};

export const createAppointment = async (patientId: string, doctorId: string, clinicId: string, slot: string, type: any): Promise<Appointment> => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
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
      patientName: 'User',
      doctor: doctor as any
    };
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

export const getDiagnosticsCentres = async (): Promise<DiagnosticsCentre[]> => {
  return Promise.resolve(mockDiagnosticsCentres);
};

export const getDiagnosticsCentreById = async (id: string): Promise<DiagnosticsCentre | null> => {
  return Promise.resolve(mockDiagnosticsCentres.find(dc => dc.id === id) || null);
};

export const getTestById = async (id: string): Promise<DiagnosticTest | null> => {
  return Promise.resolve(comprehensiveTests.find(t => t.id === id) || null);
};

export const createTestAppointment = async (patientId: string, centreId: string, testId: string): Promise<TestAppointment> => {
  const test = comprehensiveTests.find(t => t.id === testId);
  const newAppointment: TestAppointment = {
    id: `t-appt-${Date.now()}`,
    patientId,
    patientName: 'User',
    centreId,
    test: test!,
    date: new Date().toISOString(),
    time: "10:00 AM",
    status: 'Scheduled'
  };
  mockTestAppointments.push(newAppointment);
  return Promise.resolve(newAppointment);
};

export const getTestAppointmentById = async (id: string): Promise<TestAppointment | null> => {
  return Promise.resolve(mockTestAppointments.find(ta => ta.id === id) || null);
};

export const createBedReservation = async (patientId: string, hospitalId: string, bedType: string, patientName: string): Promise<Appointment> => {
  const hospital = mockHospitals.find(h => h.id === hospitalId);
  const newReservation: Appointment = {
    id: `bed-${Date.now()}`,
    patientId,
    patientName,
    hospitalId,
    type: 'bed',
    bedType,
    status: 'confirmed',
    scheduledAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    date: new Date().toISOString(),
    hospital: hospital
  };
  mockAppointments.push(newReservation);
  return Promise.resolve(newReservation);
};

export const comprehensiveHospitalDepartments = [
    'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Gastroenterology', 'General Surgery', 'Radiology', 'Maternity'
];

export const comprehensiveSpecialties = [
    'Cardiology', 'Pediatrics', 'General Physician', 'Dermatology', 
    'Neurology', 'Orthopedics', 'Gynecology', 'Dentistry', 'Ophthalmology'
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

export const getUsers = async (): Promise<User[]> => {
  return Promise.resolve(mockUsers);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  return Promise.resolve(mockUsers.find(u => u.uid === uid) || null);
};

export const updateUserProfile = async (uid: string, data: any): Promise<void> => {
  const index = mockUsers.findIndex(u => u.uid === uid);
  if (index !== -1) mockUsers[index] = { ...mockUsers[index], ...data };
  return Promise.resolve();
};

export const updateDoctorProfile = async (uid: string, data: any): Promise<void> => {
  const index = mockDoctors.findIndex(d => d.userId === uid);
  if (index !== -1) mockDoctors[index] = { ...mockDoctors[index], ...data };
  return Promise.resolve();
};

export const updateUserVerification = async (uid: string, status: boolean): Promise<void> => {
  const index = mockUsers.findIndex(u => u.uid === uid);
  if (index !== -1) mockUsers[index].verified = status;
  return Promise.resolve();
};

export const getAppointmentsForClinic = async (clinicId: string): Promise<Appointment[]> => {
  return Promise.resolve(mockAppointments.filter(a => a.clinicId === clinicId));
};

export const getTestAppointmentsForCentre = async (centreId: string): Promise<TestAppointment[]> => {
  return Promise.resolve(mockTestAppointments.filter(a => a.centreId === centreId));
};

/**
 * AyurGenixAI - Integrated Ayurvedic Knowledge Base
 */
const AYURVEDA_DATABASE: AyurvedaRecommendation[] = [
  {
    disease: "Diabetes",
    doshas: ["Pitta", "Kapha"],
    prakriti: "Kapha",
    herbs: ["Jamun", "Gudmar", "Fenugreek"],
    formulation: "Fenugreek (3g daily)",
    yoga: ["Surya Namaskar", "Pranayama"],
    diet: {
      eat: ["Low-GI foods", "Green vegetables", "Bitter melon"],
      avoid: ["Sugary foods", "Processed carb", "Heavy sweets"]
    },
    routine: [
      { time: "06:00 AM", action: "Wake up & drink warm water" },
      { time: "07:00 AM", action: "Pranayama & Surya Namaskar" },
      { time: "08:00 PM", action: "Early light dinner" }
    ],
    prevention: "Regular exercise & weight management",
    severity: "Moderate to High"
  },
  {
    disease: "Hypertension",
    doshas: ["Pitta", "Vata"],
    prakriti: "Pitta",
    herbs: ["Ashwagandha", "Arjuna", "Brahmi"],
    formulation: "Ashwagandha (5g daily)",
    yoga: ["Surya Namaskar", "Meditation", "Savasana"],
    diet: {
      eat: ["Whole grains", "Fruits", "Low-salt meals"],
      avoid: ["Spicy foods", "Excessive salt", "Caffeine"]
    },
    routine: [
      { time: "06:30 AM", action: "Meditation & deep breathing" },
      { time: "05:00 PM", action: "Gentle evening walk" },
      { time: "10:00 PM", action: "Restorative sleep" }
    ],
    prevention: "Salt restriction & stress management",
    severity: "High"
  },
  {
    disease: "Common Cold",
    doshas: ["Kapha", "Vata"],
    prakriti: "Kapha",
    herbs: ["Tulsi", "Ginger", "Turmeric"],
    formulation: "Tulsi leaves (5), Ginger (1g)",
    yoga: ["Pranayama", "Anulom Vilom"],
    diet: {
      eat: ["Warm soups", "Herbal tea", "Spiced milk"],
      avoid: ["Chilled water", "Ice cream", "Heavy dairy"]
    },
    routine: [
      { time: "07:00 AM", action: "Salt water gargle" },
      { time: "08:00 AM", action: "Steam inhalation" },
      { time: "09:00 PM", action: "Warm turmeric milk" }
    ],
    prevention: "Hygiene & immunity boosting",
    severity: "Mild to Moderate"
  },
  {
    disease: "Asthma",
    doshas: ["Kapha", "Vata"],
    prakriti: "Kapha",
    herbs: ["Ashwagandha", "Tulsi", "Mulethi"],
    formulation: "Mulethi (1/2 tsp), Honey (1 tsp)",
    yoga: ["Pranayama", "Kapalbhati"],
    diet: {
      eat: ["Light warm meals", "Ginger", "Black pepper"],
      avoid: ["Cold drinks", "Dusty environments", "Fermented foods"]
    },
    routine: [
      { time: "06:00 AM", action: "Nadi Shodhana Pranayama" },
      { time: "08:00 AM", action: "Chest massage with warm oil" },
      { time: "06:00 PM", action: "Avoid late night heavy meals" }
    ],
    prevention: "Avoid allergens & breathing exercises",
    severity: "Moderate to Severe"
  },
  {
    disease: "Acidity",
    doshas: ["Pitta"],
    prakriti: "Pitta",
    herbs: ["Amla", "Ajwain", "Aloe Vera"],
    formulation: "Aloe vera (10ml) with water",
    yoga: ["Sitaliy Pranayama", "Vajrasana"],
    diet: {
      eat: ["Cucumber", "Coconut water", "Fennel seeds"],
      avoid: ["Fried foods", "Spicy masalas", "Citrus fruits"]
    },
    routine: [
      { time: "07:00 AM", action: "Aloe vera juice intake" },
      { time: "01:00 PM", action: "Post-lunch Vajrasana (5 mins)" },
      { time: "09:00 PM", action: "Early light dinner" }
    ],
    prevention: "Small meals & avoid spicy triggers",
    severity: "Mild to Moderate"
  }
];

export const getAyurvedaCare = async (symptoms: string[]): Promise<AyurvedaRecommendation | null> => {
  const s = symptoms.map(s => s.toLowerCase());
  
  if (s.includes('breathing')) return Promise.resolve(AYURVEDA_DATABASE.find(d => d.disease === 'Asthma')!);
  if (s.includes('fever') || s.includes('cough')) return Promise.resolve(AYURVEDA_DATABASE.find(d => d.disease === 'Common Cold')!);
  if (s.includes('fatigue')) return Promise.resolve(AYURVEDA_DATABASE.find(d => d.disease === 'Diabetes')!);
  if (s.includes('pain')) return Promise.resolve(AYURVEDA_DATABASE.find(d => d.disease === 'Hypertension')!);
  
  // Default to Acidity/Indigestion for general discomfort
  return Promise.resolve(AYURVEDA_DATABASE.find(d => d.disease === 'Acidity')!);
};
