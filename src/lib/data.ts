

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
  { uid: 'doc-ashutosh', name: 'Dr. Ashutosh Nayak', email: 'ashutosh.nayak@test.com', phone: '09073945866', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-prattay', name: 'Dr. Prattay Ghosh', email: 'prattay.ghosh@test.com', phone: '07679944040', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-amitabha', name: 'Dr. Amitabha Saha', email: 'amitabha.saha@test.com', phone: 'N/A', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-rkgupta', name: 'Dr. R K Gupta', email: 'rk.gupta@test.com', phone: '09331926111', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-saugat', name: 'Dr. Saugat Banerjee', email: 'saugat.banerjee@test.com', phone: '08336971217', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-arvind', name: 'Dr. Arvind Kumar', email: 'arvind.kumar@test.com', phone: '07596878887', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-indranil', name: 'Prof. (Dr) Indranil Dutta', email: 'indranil.dutta@test.com', phone: 'N/A', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-tania', name: 'Dr. Tania Mukherjee', email: 'tania.mukherjee@test.com', phone: 'N/A', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-saptarshi', name: 'Dr. Saptarshi Bishnu', email: 'saptarshi.bishnu@test.com', phone: '09147023666', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
  { uid: 'doc-cngupta', name: 'Dr. C.N. Gupta', email: 'cn.gupta@test.com', phone: '07076642946', role: 'doctor', verified: true, createdAt: { seconds: 1672531200, nanoseconds: 0 } },
];

const mockDoctors: DoctorDetails[] = [
  { id: 'doctor-1', userId: 'doctor-1', name: 'Dr. Emily Carter', email: 'emily.carter@test.com', specialization: 'Cardiology', licenseNo: 'DOC-L12345', consultationFee: 800, availability: ["10:00 AM", "11:00 AM", "02:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: 'https://picsum.photos/seed/doc1/150/150', phone: '111-222-3333', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-2', userId: 'doctor-2', name: 'Dr. John Smith', email: 'john.smith@test.com', specialization: 'Dermatology', licenseNo: 'DOC-L67890', consultationFee: 700, availability: ["09:00 AM", "11:30 AM"], clinicId: 'clinic-2', verified: false, imageUrl: 'https://i.pravatar.cc/150?u=doc2', phone: '444-555-6666', clinicName: 'Oakwood Medical' },
  { id: 'doctor-3', userId: 'doctor-3', name: 'Dr. Sarah Lee', email: 'sarah.lee@test.com', specialization: 'Pediatrics', licenseNo: 'DOC-L54321', consultationFee: 600, availability: ["10:00 AM", "01:00 PM", "03:00 PM"], clinicId: 'clinic-1', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc3', phone: '777-888-9999', clinicName: 'Sunnyvale Clinic' },
  { id: 'doctor-test', userId: 'doctor-test', name: 'Dr. Kushal P. Anand', email: 'doctor@test.com', specialization: 'General Practice', licenseNo: 'DOC-TEST', consultationFee: 500, availability: ["09:00 AM", "10:00 AM", "11:00 AM"], clinicId: 'clinic-1', verified: true, imageUrl: '/Doc.jpg', phone: '8420382000', clinicName: 'Sunnyvale Clinic' },
  { id: 'doc-ashutosh', userId: 'doc-ashutosh', name: 'Dr. Ashutosh Nayak', email: 'ashutosh.nayak@test.com', specialization: 'Surgeon', licenseNo: 'DOC-L98765', consultationFee: 1000, availability: ["04:00 PM", "05:00 PM"], clinicId: 'hosp-4', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc4', phone: '09073945866', clinicName: 'Healthworld Hospitals, Asansol' },
  { id: 'doc-prattay', userId: 'doc-prattay', name: 'Dr. Prattay Ghosh', email: 'prattay.ghosh@test.com', specialization: 'General Physician', licenseNo: 'DOC-L87654', consultationFee: 900, availability: ["09:00 AM", "12:00 PM", "03:00 PM"], clinicId: 'hosp-12', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc5', phone: '07679944040', clinicName: 'Apollo Multispeciality Hospitals, Kolkata' },
  { id: 'doc-amitabha', userId: 'doc-amitabha', name: 'Dr. Amitabha Saha', email: 'amitabha.saha@test.com', specialization: 'General Physician', licenseNo: 'DOC-L76543', consultationFee: 850, availability: ["10:00 AM", "01:00 PM"], clinicId: 'clinic-15', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc6', phone: 'N/A', clinicName: 'Apollo Clinic Beliaghata' },
  { id: 'doc-rkgupta', userId: 'doc-rkgupta', name: 'Dr. R K Gupta', email: 'rk.gupta@test.com', specialization: 'General Physician', licenseNo: 'DOC-L65432', consultationFee: 950, availability: ["05:00 PM", "06:00 PM", "07:00 PM"], clinicId: 'clinic-16', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc7', phone: '09331926111', clinicName: 'Apollo Clinic Park Circus' },
  { id: 'doc-saugat', userId: 'doc-saugat', name: 'Dr. Saugat Banerjee', email: 'saugat.banerjee@test.com', specialization: 'Doctor', licenseNo: 'DOC-L11223', consultationFee: 750, availability: ["06:00 PM", "07:00 PM", "08:00 PM"], clinicId: 'clinic-20', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc8', phone: '08336971217', clinicName: 'Seva Clinic' },
  { id: 'doc-arvind', userId: 'doc-arvind', name: 'Dr. Arvind Kumar', email: 'arvind.kumar@test.com', specialization: 'Diabetologist', licenseNo: 'DOC-L22334', consultationFee: 800, availability: ["05:30 PM", "06:30 PM"], clinicId: 'clinic-7', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc9', phone: '07596878887', clinicName: 'Dr. Arvind Kumar Clinic' },
  { id: 'doc-indranil', userId: 'doc-indranil', name: 'Prof. (Dr) Indranil Dutta', email: 'indranil.dutta@test.com', specialization: 'Doctor', licenseNo: 'DOC-L33445', consultationFee: 1000, availability: ["03:00 PM", "04:00 PM"], clinicId: 'hosp-10', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc10', phone: 'N/A', clinicName: 'S.N.R Carnival Hospital' },
  { id: 'doc-tania', userId: 'doc-tania', name: 'Dr. Tania Mukherjee', email: 'tania.mukherjee@test.com', specialization: 'ENT Specialist', licenseNo: 'DOC-L44556', consultationFee: 800, availability: ["10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"], clinicId: 'clinic-9', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc11', phone: 'N/A', clinicName: "Dr. Tania Mukherjee's Clinic" },
  { id: 'doc-saptarshi', userId: 'doc-saptarshi', name: 'Dr. Saptarshi Bishnu', email: 'saptarshi.bishnu@test.com', specialization: 'Gastroenterologist', licenseNo: 'DOC-L55667', consultationFee: 1200, availability: ["04:00 PM", "05:00 PM", "06:00 PM"], clinicId: 'clinic-12', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc12', phone: '09147023666', clinicName: "Chittaranjan Clinic Pvt ltd" },
  { id: 'doc-cngupta', userId: 'doc-cngupta', name: 'Dr. C.N. Gupta', email: 'cn.gupta@test.com', specialization: 'Doctor', licenseNo: 'DOC-L66778', consultationFee: 600, availability: ["05:00 PM", "06:00 PM"], clinicId: 'diag-4', verified: true, imageUrl: 'https://i.pravatar.cc/150?u=doc13', phone: '07076642946', clinicName: "The Burdwan Medical Centre" },
];

const mockClinics: ClinicDetails[] = [
  { id: 'clinic-1', userId: 'clinic-1', name: 'Sunnyvale Clinic', address: '123 Health St, Wellness City', licenseNo: 'CLN-A123', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-1/400/200', doctors: [mockDoctors[0], mockDoctors[2], mockDoctors[3]] },
  { id: 'clinic-2', userId: 'clinic-2', name: 'Oakwood Medical', address: '456 Cure Ave, Remedy Town', licenseNo: 'CLN-B456', verified: false, imageUrl: 'https://picsum.photos/seed/clinic-2/400/200', doctors: [mockDoctors[1]] },
  { id: 'clinic-3', userId: 'clinic-3', name: '1 Mall Road Clinic', address: '1 Mall Road, Kolkata', licenseNo: 'CLN-C789', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-3/400/200', doctors: [] },
  { id: 'clinic-4', userId: 'clinic-4', name: 'Suraksha Clinic', address: 'Central Pollution Board, Kolkata', licenseNo: 'CLN-D012', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-4/400/200', doctors: [] },
  { id: 'clinic-5', userId: 'clinic-5', name: 'Townsend Road Practice', address: '21, Townsend Rd, Kolkata', licenseNo: 'CLN-E345', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-5/400/200', doctors: [] },
  { id: 'clinic-6', userId: 'clinic-6', name: 'B-9/20 Kalyani Clinic', address: 'B-9/20, Kalyani', licenseNo: 'CLN-F678', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-6/400/200', doctors: [] },
  { id: 'clinic-7', userId: 'clinic-7', name: 'Dr. Arvind Kumar Clinic', address: 'B2/54, Kalyani', licenseNo: 'CLN-G901', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-7/400/200', doctors: [mockDoctors[9]] },
  { id: 'clinic-8', userId: 'clinic-8', name: 'GICE NURSING HOME', address: 'A-3/3S Kalyani', licenseNo: 'CLN-H234', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-8/400/200', doctors: [] },
  { id: 'clinic-9', userId: 'clinic-9', name: "Dr. Tania Mukherjee's Clinic", address: '62 N, S.B Gorai Road, opp. IMA House, Asansol', licenseNo: 'CLN-I567', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-9/400/200', doctors: [mockDoctors[11]] },
  { id: 'clinic-10', userId: 'clinic-10', name: 'Bengal Institute of Gastroenterology', address: 'Burir Bagan, Rani Sayer North, 71, BB Ghosh Rd, Burdwan', licenseNo: 'CLN-J890', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-10/400/200', doctors: [] },
  { id: 'clinic-11', userId: 'clinic-11', name: "Dr. C.N. Gupta's Clinic", address: 'RC Das Road, Burdwan', licenseNo: 'CLN-K123', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-11/400/200', doctors: [mockDoctors[13]] },
  { id: 'clinic-12', userId: 'clinic-12', name: 'Chittaranjan Clinic Pvt ltd', address: 'Ramkrishna Road, Burdwan', licenseNo: 'CLN-L456', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-12/400/200', doctors: [mockDoctors[12]] },
  { id: 'clinic-13', userId: 'clinic-13', name: 'Astha Medical Centre', address: '6VW6+WJX, Burdwan', licenseNo: 'CLN-M789', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-13/400/200', doctors: [] },
  { id: 'clinic-14', userId: 'clinic-14', name: "Petals Woman's Clinic", address: '11 A, Sarojini Naidu Sarani, Rawdon St, Kolkata', licenseNo: 'CLN-N012', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-14/400/200', doctors: [] },
  { id: 'clinic-15', userId: 'clinic-15', name: 'Apollo Clinic Beliaghata', address: '13A, Hem Chandra Naskar Rd, Kolkata', licenseNo: 'CLN-O345', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-15/400/200', doctors: [mockDoctors[6]] },
  { id: 'clinic-16', userId: 'clinic-16', name: 'Apollo Clinic Park Circus', address: '8, Circus Row, Kolkata', licenseNo: 'CLN-P678', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-16/400/200', doctors: [mockDoctors[7]] },
  { id: 'clinic-17', userId: 'clinic-17', name: 'Healthworld Clinic Asansol', address: 'MWVX+2H2, Burnpur Rd, Asansol', licenseNo: 'CLN-Q901', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-17/400/200', doctors: [] },
  { id: 'clinic-18', userId: 'clinic-18', name: 'The Mission Hospital Asansol Clinic', address: 'MXV2+J4V, Asansol-Neamatpur Rd, Asansol', licenseNo: 'CLN-R234', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-18/400/200', doctors: [] },
  { id: 'clinic-19', userId: 'clinic-19', name: 'Ultra Clinic', address: 'Ground Floor, Sahara Apartment, Asansol', licenseNo: 'CLN-S567', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-19/400/200', doctors: [] },
  { id: 'clinic-20', userId: 'clinic-20', name: 'Seva Clinic', address: 'B-3/17, Kalyani', licenseNo: 'CLN-T890', verified: true, imageUrl: 'https://picsum.photos/seed/clinic-20/400/200', doctors: [mockDoctors[8]] },
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
  { id: 'diag-4', name: 'The Burdwan Medical Centre', location: 'KHOSEBAGAN P.O.:, 23, RAMKRISHNA ROAD, Burdwan', contact: { phone: 'N/A', email: 'contact@burdwanmed.com' }, rating: 4.9, imageUrl: 'https://picsum.photos/seed/diag-4/400/200', dataAiHint: 'diagnostic center', tests: comprehensiveTests.slice(4,8), pathologists: [] },
  { id: 'diag-5', name: 'Mitali Memorial Polyclinic', location: 'A9X/5S, Kalyani', contact: { phone: '094322 52863', email: 'contact@mitalipolyclinic.com' }, rating: 2.7, imageUrl: 'https://picsum.photos/seed/diag-5/400/200', dataAiHint: 'diagnostic center', tests: comprehensiveTests.slice(2,7), pathologists: [] },
  { id: 'diag-6', name: 'Kalyani Diagnostic Centre', location: 'XFC6+PJ9, 46, Road, near Vidyasagar Mancha JN, Kalyani', contact: { phone: 'N/A', email: 'contact@kalyanidiag.com' }, rating: 3.9, imageUrl: 'https://picsum.photos/seed/diag-6/400/200', dataAiHint: 'diagnostic center', tests: comprehensiveTests.slice(0,5), pathologists: [] },
  { id: 'diag-7', name: 'Suraksha Diagnostic Centre Kalyani', location: 'Central Park, B10/178, opposite SBI, Kalyani', contact: { phone: 'N/A', email: 'contact@surakshakalyani.com' }, rating: 5.0, imageUrl: 'https://picsum.photos/seed/diag-7/400/200', dataAiHint: 'modern clinic', tests: comprehensiveTests.slice(3,10), pathologists: [] },
  { id: 'diag-8', name: 'Lupin Diagnostics', location: 'D-19/15(S), (Opp Kalyani Spinning Mill Kalyani, P.O...', contact: { phone: 'N/A', email: 'contact@lupindiag.com' }, rating: 5.0, imageUrl: 'https://picsum.photos/seed/diag-8/400/200', dataAiHint: 'pathology lab', tests: comprehensiveTests.slice(1,8), pathologists: [] },
  { id: 'diag-9', name: 'Suraksha Diagnostics - Asansol', location: '9/190, Anand Appartment, G.T. Road, Asansol', contact: { phone: 'N/A', email: 'contact@surakshaasansol.com' }, rating: 4.6, imageUrl: 'https://picsum.photos/seed/diag-9/400/200', dataAiHint: 'diagnostic clinic', tests: comprehensiveTests.slice(0,6), pathologists: [] },
  { id: 'diag-10', name: 'Avishkar Diagnostic, Asansol', location: 'Ground Floor, Sarada Enclave, Grand Trunk Rd, Asansol', contact: { phone: 'N/A', email: 'contact@avishkarasansol.com' }, rating: 2.7, imageUrl: 'https://picsum.photos/seed/diag-10/400/200', dataAiHint: 'testing centre', tests: comprehensiveTests.slice(5,10), pathologists: [] },
  { id: 'diag-11', name: 'Asansol Diagnostics', location: 'Burnpur Rd, Asansol', contact: { phone: '081455 55593', email: 'contact@asansoldiag.com' }, rating: 4.0, imageUrl: 'https://picsum.photos/seed/diag-11/400/200', dataAiHint: 'diagnostic imaging', tests: comprehensiveTests.slice(2,8), pathologists: [] },
  { id: 'diag-12', name: 'SONOSCAN', location: '44, CIT Rd, near Ladies Park, Kolkata', contact: { phone: '09775... (Number Incomplete)', email: 'contact@sonoscan.com' }, rating: 4.7, imageUrl: 'https://picsum.photos/seed/diag-12/400/200', dataAiHint: 'ultrasound scanner', tests: comprehensiveTests.slice(6, 9), pathologists: [] },
  { id: 'diag-13', name: 'Vijaya Diagnostic Centre', location: 'D No. 173, 4/5, VIP Rd, beside O2 Hotel, Kolkata', contact: { phone: 'N/A', email: 'contact@vijayadiag.com' }, rating: 4.6, imageUrl: 'https://picsum.photos/seed/diag-13/400/200', dataAiHint: 'diagnostic clinic', tests: comprehensiveTests.slice(0, 7), pathologists: [] },
  { id: 'diag-14', name: 'Aloka Medicare Pvt Ltd', location: '114B, Sarat Bose Rd, Kolkata', contact: { phone: '078900 78966', email: 'contact@alokamedicare.com' }, rating: 4.9, imageUrl: 'https://picsum.photos/seed/diag-14/400/200', dataAiHint: 'modern laboratory', tests: comprehensiveTests, pathologists: [] },
  { id: 'diag-15', name: 'Burdwan Scan Centre Pvt. Ltd.', location: '7, R.B. Ghosh Rd, Burdwan', contact: { phone: '0342 255 0829', email: 'contact@burdwanscan.com' }, rating: 4.5, imageUrl: 'https://picsum.photos/seed/diag-15/400/200', dataAiHint: 'medical laboratory', tests: comprehensiveTests.slice(0,8), pathologists: [] },
  { id: 'diag-16', name: 'Agilus Diagnostics - RB Ghosh Road', location: 'Shop No 30, Khoshbagan, R.B.Ghosh Rd, Burdwan', contact: { phone: '08071 3...', email: 'contact@agilusburdwan.com' }, rating: 4.9, imageUrl: 'https://picsum.photos/seed/diag-16/400/200', dataAiHint: 'diagnostic lab', tests: comprehensiveTests.slice(1,6), pathologists: [] },
];

const mockHospitals: Hospital[] = [
    { id: 'hosp-1', name: 'Metro General Hospital', location: { address: '1 Hospital Plaza, Metro City' }, contact: '555-111-1111', rating: 4.8, specialties: ['Emergency', 'Cardiology', 'General Surgery'], emergencyAvailable: true, beds: { general: { total: 100, available: 20 }, icu: { total: 20, available: 3 }, ventilator: { total: 10, available: 1 }, oxygen: { total: 50, available: 10 } }, lastUpdated: new Date().toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-1/600/400', dataAiHint: 'hospital building' },
    { id: 'hosp-2', name: 'Hope Childrens Hospital', location: { address: '2 Hope St, Kidville' }, contact: '555-222-2222', rating: 4.9, specialties: ['Pediatrics', 'Maternity', 'Emergency'], emergencyAvailable: true, beds: { general: { total: 50, available: 15 }, icu: { total: 10, available: 5 }, ventilator: { total: 5, available: 2 }, oxygen: { total: 20, available: 8 } }, lastUpdated: new Date(Date.now() - 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-2/600/400', dataAiHint: 'children hospital' },
    { id: 'hosp-3', name: 'HLG Memorial Hospital', location: { address: 'Sen Raliegh Rd, Asansol' }, contact: '08101880088', rating: 4.2, specialties: ['General Medicine', 'Emergency'], emergencyAvailable: true, beds: { general: { total: 75, available: 18 }, icu: { total: 15, available: 2 }, ventilator: { total: 8, available: 1 }, oxygen: { total: 30, available: 12 } }, lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-3/600/400', dataAiHint: 'hospital exterior' },
    { id: 'hosp-4', name: 'Healthworld Hospitals, Asansol', location: { address: 'PW3X+M72, Asansol' }, contact: 'N/A', rating: 4.0, specialties: ['Multispeciality', 'Orthopedics'], emergencyAvailable: true, beds: { general: { total: 120, available: 30 }, icu: { total: 25, available: 5 }, ventilator: { total: 12, available: 3 }, oxygen: { total: 60, available: 22 } }, lastUpdated: new Date(Date.now() - 4 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-4/600/400', dataAiHint: 'modern hospital' },
    { id: 'hosp-5', name: 'BLESS HOSPITAL', location: { address: 'Jyoti Nagar, Shakespeare Sarani, Asansol' }, contact: 'N/A', rating: 4.3, specialties: ['General Surgery', 'Gynaecology'], emergencyAvailable: true, beds: { general: { total: 60, available: 10 }, icu: { total: 10, available: 4 }, ventilator: { total: 5, available: 0 }, oxygen: { total: 25, available: 7 } }, lastUpdated: new Date(Date.now() - 8 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-5/600/400', dataAiHint: 'clinic building' },
    { id: 'hosp-6', name: 'Sharanya Multispeciality Hospital', location: { address: 'Gopalnagar, West Bengal' }, contact: '094756 41904', rating: 4.3, specialties: ['General Hospital'], emergencyAvailable: true, beds: { general: { total: 50, available: 12 }, icu: { total: 8, available: 3 }, ventilator: { total: 4, available: 1 }, oxygen: { total: 20, available: 9 } }, lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-6/600/400', dataAiHint: 'hospital building' },
    { id: 'hosp-7', name: 'Teresa Memorial Hospital', location: { address: 'NH 2, beside Anamoy Superspeciality Hospital, Burdwan' }, contact: '074777 97607', rating: 4.4, specialties: ['Hospital'], emergencyAvailable: true, beds: { general: { total: 65, available: 22 }, icu: { total: 12, available: 5 }, ventilator: { total: 6, available: 2 }, oxygen: { total: 30, available: 15 } }, lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-7/600/400', dataAiHint: 'modern hospital' },
    { id: 'hosp-8', name: 'AHAD MULTISPECIALITY HOSPITAL', location: { address: 'Bardhaman, West Bengal' }, contact: '075869 56333', rating: 4.2, specialties: ['Hospital'], emergencyAvailable: true, beds: { general: { total: 80, available: 15 }, icu: { total: 15, available: 4 }, ventilator: { total: 7, available: 3 }, oxygen: { total: 40, available: 18 } }, lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-8/600/400', dataAiHint: 'hospital exterior' },
    { id: 'hosp-9', name: 'Rainbow Specialty Hospital', location: { address: 'B- 13/23 (CA), Near Central Park, Kalyani' }, contact: 'N/A', rating: 4.5, specialties: ['Specialty'], emergencyAvailable: true, beds: { general: { total: 90, available: 18 }, icu: { total: 18, available: 3 }, ventilator: { total: 9, available: 2 }, oxygen: { total: 45, available: 10 } }, lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-9/600/400', dataAiHint: 'hospital building' },
    { id: 'hosp-10', name: 'S.N.R Carnival Hospital', location: { address: 'Barrackpore - Kalyani Expy, Kalyani' }, contact: '091239 17718', rating: 4.7, specialties: ['Carnival'], emergencyAvailable: true, beds: { general: { total: 70, available: 14 }, icu: { total: 14, available: 4 }, ventilator: { total: 7, available: 1 }, oxygen: { total: 35, available: 11 } }, lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-10/600/400', dataAiHint: 'modern hospital' },
    { id: 'hosp-11', name: 'Jaymala Memorial Hospital', location: { address: 'A-1/3, Kalyani' }, contact: '082964 63015', rating: 3.7, specialties: ['Private Hospital'], emergencyAvailable: true, beds: { general: { total: 55, available: 11 }, icu: { total: 11, available: 2 }, ventilator: { total: 5, available: 1 }, oxygen: { total: 27, available: 8 } }, lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-11/600/400', dataAiHint: 'clinic building' },
    { id: 'hosp-12', name: 'Apollo Multispeciality Hospitals, Kolkata', location: { address: '58, Canal Circular Rd, Kolkata' }, contact: '080 6297 2764', rating: 4.7, specialties: ['Multispeciality'], emergencyAvailable: true, beds: { general: { total: 200, available: 40 }, icu: { total: 40, available: 8 }, ventilator: { total: 20, available: 3 }, oxygen: { total: 100, available: 25 } }, lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-12/600/400', dataAiHint: 'city hospital' },
    { id: 'hosp-13', name: 'Desun Hospital', location: { address: 'Desun More, 720, Eastern Metropolitan Bypass, Kolkata' }, contact: 'N/A', rating: 4.6, specialties: ['Private Hospital', 'Cardiology'], emergencyAvailable: true, beds: { general: { total: 300, available: 50 }, icu: { total: 75, available: 10 }, ventilator: { total: 40, available: 5 }, oxygen: { total: 150, available: 30 } }, lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-13/600/400', dataAiHint: 'hospital building' },
    { id: 'hosp-14', name: 'Manipal Hospitals Broadway', location: { address: 'JC-16 & 17, No. 3A, Broadway Rd, opp. to Stadium, Kolkata' }, contact: 'N/A', rating: 4.7, specialties: ['Private Hospital', 'Oncology'], emergencyAvailable: true, beds: { general: { total: 180, available: 35 }, icu: { total: 35, available: 7 }, ventilator: { total: 15, available: 2 }, oxygen: { total: 90, available: 18 } }, lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString(), imageUrl: 'https://picsum.photos/seed/hosp-14/600/400', dataAiHint: 'modern hospital' },
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
    "Cardiology", "Neurology", "Nephrology", "Endocrinology", "Gastroenterology", "Surgeon", "General Physician",
    "Doctor", "Diabetologist", "ENT Specialist", "Gastroenterologist"
];

export const comprehensiveHospitalDepartments = [
    'Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Oncology', 'Gastroenterology', 'General Surgery', 'Radiology', 'Maternity'
];


export const getHospitals = async (): Promise<Hospital[]> => {
    console.log("MOCK: getHospitals called.");
    return Promise.resolve(mockHospitals);
}

export const getHospitalById = async (id: string): Promise<Hospital | undefined> => {
  console.log(`MOCK: getHospitalById for id: ${id}`);
  return Promise.resolve(mockHospitals.find(h => h.id === id));
};

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

export const getTestById = async (id: string): Promise<DiagnosticTest | undefined> => {
    console.log(`MOCK: getTestById for id: ${id}`);
    return Promise.resolve(comprehensiveTests.find(t => t.id === id));
}

export const createTestAppointment = async (
    patientId: string,
    centreId: string,
    testId: string
): Promise<TestAppointment> => {
    const patient = await getUserProfile(patientId);
    const test = await getTestById(testId);
    if (!patient || !test) {
        throw new Error("Patient or Test not found");
    }

    const newAppt: TestAppointment = {
        id: `t-appt-${Date.now()}`,
        patientId,
        patientName: patient.name,
        centreId,
        test,
        date: new Date().toISOString(),
        time: "10:00 AM", // Mock time
        status: "Scheduled"
    };
    mockTestAppointments.push(newAppt);
    return Promise.resolve(newAppt);
}

export const getTestAppointmentById = async (id: string): Promise<TestAppointment | undefined> => {
   console.log(`MOCK: getTestAppointmentById for id: ${id}`);
   const appointment = mockTestAppointments.find(app => app.id === id);
   if(appointment) {
       if (!appointment.test) {
           const foundTest = comprehensiveTests.find(t => t.id === (appointment.test as any));
           if(foundTest) appointment.test = foundTest;
       }
   }
   return Promise.resolve(appointment);
};


export const getTestAppointmentsForCentre = async (centreId: string): Promise<TestAppointment[]> => {
    console.log(`MOCK: getTestAppointmentsForCentre for centreId: ${centreId}`);
    return Promise.resolve(mockTestAppointments.filter(app => app.centreId === centreId));
};
