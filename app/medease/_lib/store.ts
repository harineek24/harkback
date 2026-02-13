// In-memory data store for MedEase demo
// Pre-seeded with demo data - resets on server restart

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  schedule: Record<string, string[]>;
}

export interface Patient {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
  insurance_provider: string;
  insurance_id: string;
  group_number: string;
}

export interface Summary {
  id: number;
  patient_id: number;
  patient_name: string;
  summary: string;
  date_processed: string;
  filename: string;
}

export interface Consultation {
  id: number;
  patient_id: number;
  session_id: string;
  doctor_notes: Record<string, string>;
  transcript: string;
  summary: string;
  date: string;
}

export interface PatientUpdate {
  id: number;
  patient_id: number;
  text: string;
  audio_url: string | null;
  ai_summary: string | null;
  ai_questions: string[];
  created_at: string;
  replies: DoctorReply[];
}

export interface DoctorReply {
  id: number;
  doctor_id: number;
  doctor_name: string;
  text: string;
  created_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  doctor_name: string;
  specialty: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  reason: string;
}

export interface BillingRecord {
  id: number;
  patient_id: number;
  patient_name: string;
  service: string;
  amount: number;
  insurance_covered: number;
  patient_responsibility: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

export interface Vitals {
  heart_rate: number[];
  blood_pressure: { systolic: number; diastolic: number }[];
  spo2: number[];
  pulse_rate: number[];
  timestamps: string[];
}

export interface TestResult {
  name: string;
  value: number;
  unit: string;
  reference_min: number;
  reference_max: number;
  date: string;
}

// ─── Demo Data ───

const doctors: Doctor[] = [
  {
    id: 1, name: "Dr. Sarah Chen", specialty: "Internal Medicine",
    email: "sarah.chen@medease.demo", phone: "(555) 100-0001",
    schedule: {
      "Monday": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
      "Tuesday": ["09:00", "09:30", "10:00", "14:00", "14:30"],
      "Wednesday": ["09:00", "09:30", "10:00", "10:30", "11:00"],
      "Thursday": ["09:00", "10:00", "14:00", "15:00"],
      "Friday": ["09:00", "09:30", "10:00"],
    }
  },
  {
    id: 2, name: "Dr. James Wilson", specialty: "Cardiology",
    email: "james.wilson@medease.demo", phone: "(555) 100-0002",
    schedule: {
      "Monday": ["10:00", "10:30", "11:00", "14:00"],
      "Tuesday": ["09:00", "09:30", "10:00", "10:30"],
      "Wednesday": ["14:00", "14:30", "15:00", "15:30"],
      "Thursday": ["09:00", "09:30", "10:00", "14:00", "14:30"],
      "Friday": ["09:00", "10:00", "11:00"],
    }
  },
  {
    id: 3, name: "Dr. Priya Patel", specialty: "Neurology",
    email: "priya.patel@medease.demo", phone: "(555) 100-0003",
    schedule: {
      "Monday": ["09:00", "09:30", "14:00", "14:30"],
      "Tuesday": ["10:00", "10:30", "11:00"],
      "Wednesday": ["09:00", "09:30", "10:00", "14:00"],
      "Thursday": ["09:00", "10:00", "14:00", "15:00"],
      "Friday": ["09:00", "09:30", "10:00", "10:30"],
    }
  },
  {
    id: 4, name: "Dr. Michael Brown", specialty: "Orthopedics",
    email: "michael.brown@medease.demo", phone: "(555) 100-0004",
    schedule: {
      "Monday": ["09:00", "10:00", "11:00"],
      "Tuesday": ["09:00", "10:00", "14:00", "15:00"],
      "Wednesday": ["09:00", "09:30", "10:00"],
      "Thursday": ["14:00", "14:30", "15:00", "15:30"],
      "Friday": ["09:00", "10:00"],
    }
  },
];

const patients: Patient[] = [
  {
    id: 1, name: "Alex Johnson", username: "patient1", password: "demo123",
    email: "alex.johnson@demo.com", phone: "(555) 200-0001", dob: "1990-05-15",
    gender: "Male", address: "123 Main St, Springfield, IL 62701",
    emergency_contact: "Maria Johnson", emergency_phone: "(555) 200-0010",
    insurance_provider: "BlueCross BlueShield", insurance_id: "BCBS-2024-001",
    group_number: "GRP-5001",
  },
  {
    id: 2, name: "Emily Davis", username: "patient2", password: "demo123",
    email: "emily.davis@demo.com", phone: "(555) 200-0002", dob: "1985-11-22",
    gender: "Female", address: "456 Oak Ave, Springfield, IL 62702",
    emergency_contact: "Robert Davis", emergency_phone: "(555) 200-0020",
    insurance_provider: "Aetna", insurance_id: "AET-2024-002",
    group_number: "GRP-5002",
  },
];

let summaries: Summary[] = [
  {
    id: 1, patient_id: 1, patient_name: "Alex Johnson",
    summary: "## Quick Overview\n- **Patient:** Alex Johnson\n- **Date:** January 15, 2025\n- **Facility:** Springfield Medical Center\n- **Visit Type:** Annual Physical Examination\n\n## What Happened\nAlex came in for a routine annual physical. Overall health is good. Blood pressure was slightly elevated at 135/85, which the doctor is monitoring.\n\n## Your Medications\n- **Lisinopril 10mg** (blood pressure pill) - Take one tablet every morning\n- **Vitamin D 2000 IU** - Take one capsule daily\n\n## Test Results\n- Blood sugar: 95 mg/dL (Normal)\n- Cholesterol: 210 mg/dL (Slightly elevated)\n- HDL: 55 mg/dL (Good)\n- LDL: 130 mg/dL (Borderline high)\n\n## What to Do Next\n- Follow-up appointment in 3 months for blood pressure check\n- Consider dietary changes to reduce cholesterol\n- Continue regular exercise routine\n\n## When to Seek Immediate Help\n- Severe headache or vision changes\n- Chest pain or shortness of breath\n- Sudden numbness or weakness",
    date_processed: "2025-01-15T10:30:00Z", filename: "alex_annual_physical.pdf",
  },
];

let consultations: Consultation[] = [
  {
    id: 1, patient_id: 1, session_id: "sess-001",
    doctor_notes: { "Chief Complaint": "Routine follow-up", "Assessment": "Stable condition", "Plan": "Continue current medications" },
    transcript: "Doctor: How have you been feeling?\nPatient: Generally good, but some occasional headaches.\nDoctor: Are these headaches new?\nPatient: They started about two weeks ago.",
    summary: "Patient reports occasional headaches over the past two weeks. Otherwise stable on current medication regimen.",
    date: "2025-01-20T14:00:00Z",
  },
];

let patientUpdates: PatientUpdate[] = [
  {
    id: 1, patient_id: 1, text: "I've been feeling better this week. Blood pressure readings at home have been around 128/82. Still taking my medication regularly.",
    audio_url: null,
    ai_summary: "Patient reports improvement. Home BP readings are trending toward normal range (128/82). Medication adherence confirmed.",
    ai_questions: ["Are you experiencing any side effects from Lisinopril?", "Have you made any dietary changes recently?"],
    created_at: "2025-01-25T09:00:00Z",
    replies: [
      { id: 1, doctor_id: 1, doctor_name: "Dr. Sarah Chen", text: "Great to hear your BP is improving! Keep monitoring and we'll review at your next visit.", created_at: "2025-01-25T11:30:00Z" },
    ],
  },
  {
    id: 2, patient_id: 1, text: "Had a mild headache this morning but it went away after drinking water. No other symptoms.",
    audio_url: null,
    ai_summary: "Patient experienced mild, self-resolving headache. Possibly dehydration-related. No concerning associated symptoms.",
    ai_questions: ["How often are you experiencing headaches?", "How much water are you drinking daily?"],
    created_at: "2025-02-01T08:15:00Z",
    replies: [],
  },
];

let appointments: Appointment[] = [
  { id: 1, patient_id: 1, doctor_id: 1, doctor_name: "Dr. Sarah Chen", specialty: "Internal Medicine", date: "2025-02-15", time: "10:00", status: "upcoming", reason: "Blood pressure follow-up" },
  { id: 2, patient_id: 1, doctor_id: 2, doctor_name: "Dr. James Wilson", specialty: "Cardiology", date: "2025-01-10", time: "14:00", status: "completed", reason: "Cardiology consultation" },
  { id: 3, patient_id: 2, doctor_id: 1, doctor_name: "Dr. Sarah Chen", specialty: "Internal Medicine", date: "2025-02-20", time: "09:30", status: "upcoming", reason: "Annual checkup" },
];

let billingRecords: BillingRecord[] = [
  { id: 1, patient_id: 1, patient_name: "Alex Johnson", service: "Annual Physical Exam", amount: 250, insurance_covered: 200, patient_responsibility: 50, status: "paid", date: "2025-01-15" },
  { id: 2, patient_id: 1, patient_name: "Alex Johnson", service: "Blood Panel", amount: 150, insurance_covered: 120, patient_responsibility: 30, status: "paid", date: "2025-01-15" },
  { id: 3, patient_id: 1, patient_name: "Alex Johnson", service: "Cardiology Consultation", amount: 350, insurance_covered: 280, patient_responsibility: 70, status: "pending", date: "2025-01-10" },
  { id: 4, patient_id: 2, patient_name: "Emily Davis", service: "Follow-up Visit", amount: 150, insurance_covered: 120, patient_responsibility: 30, status: "pending", date: "2025-01-20" },
];

const testResultsHistory: Record<string, TestResult[]> = {
  "Blood Glucose": [
    { name: "Blood Glucose", value: 92, unit: "mg/dL", reference_min: 70, reference_max: 100, date: "2024-07-15" },
    { name: "Blood Glucose", value: 95, unit: "mg/dL", reference_min: 70, reference_max: 100, date: "2024-10-15" },
    { name: "Blood Glucose", value: 95, unit: "mg/dL", reference_min: 70, reference_max: 100, date: "2025-01-15" },
  ],
  "Total Cholesterol": [
    { name: "Total Cholesterol", value: 225, unit: "mg/dL", reference_min: 0, reference_max: 200, date: "2024-07-15" },
    { name: "Total Cholesterol", value: 218, unit: "mg/dL", reference_min: 0, reference_max: 200, date: "2024-10-15" },
    { name: "Total Cholesterol", value: 210, unit: "mg/dL", reference_min: 0, reference_max: 200, date: "2025-01-15" },
  ],
  "HDL Cholesterol": [
    { name: "HDL Cholesterol", value: 48, unit: "mg/dL", reference_min: 40, reference_max: 60, date: "2024-07-15" },
    { name: "HDL Cholesterol", value: 52, unit: "mg/dL", reference_min: 40, reference_max: 60, date: "2024-10-15" },
    { name: "HDL Cholesterol", value: 55, unit: "mg/dL", reference_min: 40, reference_max: 60, date: "2025-01-15" },
  ],
  "LDL Cholesterol": [
    { name: "LDL Cholesterol", value: 145, unit: "mg/dL", reference_min: 0, reference_max: 130, date: "2024-07-15" },
    { name: "LDL Cholesterol", value: 138, unit: "mg/dL", reference_min: 0, reference_max: 130, date: "2024-10-15" },
    { name: "LDL Cholesterol", value: 130, unit: "mg/dL", reference_min: 0, reference_max: 130, date: "2025-01-15" },
  ],
  "Blood Pressure Systolic": [
    { name: "Blood Pressure Systolic", value: 142, unit: "mmHg", reference_min: 90, reference_max: 130, date: "2024-07-15" },
    { name: "Blood Pressure Systolic", value: 138, unit: "mmHg", reference_min: 90, reference_max: 130, date: "2024-10-15" },
    { name: "Blood Pressure Systolic", value: 135, unit: "mg/dL", reference_min: 90, reference_max: 130, date: "2025-01-15" },
  ],
  "Hemoglobin A1c": [
    { name: "Hemoglobin A1c", value: 5.4, unit: "%", reference_min: 4.0, reference_max: 5.7, date: "2024-07-15" },
    { name: "Hemoglobin A1c", value: 5.3, unit: "%", reference_min: 4.0, reference_max: 5.7, date: "2025-01-15" },
  ],
};

const vitalsData: Record<number, Vitals> = {
  1: {
    heart_rate: [72, 75, 68, 71, 74, 70, 73, 69, 72, 76],
    blood_pressure: [
      { systolic: 135, diastolic: 85 }, { systolic: 132, diastolic: 84 },
      { systolic: 130, diastolic: 82 }, { systolic: 128, diastolic: 80 },
      { systolic: 131, diastolic: 83 }, { systolic: 129, diastolic: 81 },
      { systolic: 127, diastolic: 79 }, { systolic: 130, diastolic: 82 },
      { systolic: 128, diastolic: 80 }, { systolic: 126, diastolic: 78 },
    ],
    spo2: [98, 97, 98, 99, 97, 98, 98, 97, 99, 98],
    pulse_rate: [72, 75, 68, 71, 74, 70, 73, 69, 72, 76],
    timestamps: Array.from({ length: 10 }, (_, i) => {
      const d = new Date("2025-01-06");
      d.setDate(d.getDate() + i);
      return d.toISOString();
    }),
  },
};

let nextId = {
  summary: 2,
  consultation: 2,
  update: 3,
  appointment: 4,
  billing: 5,
  patient: 3,
  reply: 2,
};

// ─── Store API ───

export const store = {
  // Auth
  adminLogin(username: string, password: string) {
    if (username === "admin" && password === "admin123") {
      return { success: true, clinic_id: 1, name: "Demo Clinic Admin" };
    }
    return null;
  },

  patientLogin(username: string, password: string) {
    const p = patients.find(pt => pt.username === username && pt.password === password);
    if (p) return { success: true, patient_id: p.id, name: p.name };
    return null;
  },

  // Doctors
  getDoctors() { return doctors; },
  getDoctorById(id: number) { return doctors.find(d => d.id === id); },
  getSpecialties() { return [...new Set(doctors.map(d => d.specialty))]; },
  searchDoctors(query?: string, specialty?: string) {
    let result = doctors;
    if (specialty) result = result.filter(d => d.specialty === specialty);
    if (query) result = result.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
    return result;
  },
  getAvailableSlots(doctorId: number, date: string) {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return [];
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const allSlots = doc.schedule[dayName] || [];
    const bookedTimes = appointments
      .filter(a => a.doctor_id === doctorId && a.date === date && a.status !== "cancelled")
      .map(a => a.time);
    return allSlots.filter(s => !bookedTimes.includes(s));
  },

  // Patients
  getPatients() { return patients; },
  getPatientById(id: number) { return patients.find(p => p.id === id); },
  registerPatient(data: Partial<Patient>) {
    const id = nextId.patient++;
    const patient: Patient = {
      id,
      name: data.name || "New Patient",
      username: data.username || `patient${id}`,
      password: data.password || "demo123",
      email: data.email || "",
      phone: data.phone || "",
      dob: data.dob || "",
      gender: data.gender || "",
      address: data.address || "",
      emergency_contact: data.emergency_contact || "",
      emergency_phone: data.emergency_phone || "",
      insurance_provider: data.insurance_provider || "",
      insurance_id: data.insurance_id || "",
      group_number: data.group_number || "",
    };
    patients.push(patient);
    return { ...patient, credentials: { username: patient.username, password: patient.password } };
  },

  // Summaries
  getSummaries(patientId?: number) {
    if (patientId) return summaries.filter(s => s.patient_id === patientId);
    return summaries;
  },
  saveSummary(data: { patient_id?: number; patient_name: string; summary: string; filename: string }) {
    const id = nextId.summary++;
    const s: Summary = {
      id,
      patient_id: data.patient_id || 1,
      patient_name: data.patient_name,
      summary: data.summary,
      date_processed: new Date().toISOString(),
      filename: data.filename,
    };
    summaries.push(s);
    return s;
  },

  // Dashboard
  getDashboardStats() {
    return {
      total_patients: patients.length,
      total_summaries: summaries.length,
      total_medications: 8,
      high_risk_cases: 1,
      recent_activity: summaries.slice(-5).map(s => ({
        patient_name: s.patient_name,
        diagnosis: "Routine Checkup",
        date: s.date_processed,
      })),
      drug_interactions: [
        { severity: "high", count: 1 },
        { severity: "moderate", count: 3 },
        { severity: "low", count: 5 },
      ],
      top_medications: [
        { name: "Lisinopril", count: 12 },
        { name: "Metformin", count: 8 },
        { name: "Atorvastatin", count: 7 },
        { name: "Omeprazole", count: 5 },
        { name: "Amlodipine", count: 4 },
        { name: "Vitamin D", count: 3 },
      ],
    };
  },

  // Test Results
  getTestResultNames() { return Object.keys(testResultsHistory); },
  getTestResultHistory(testName: string) { return testResultsHistory[testName] || []; },

  // Medications timeline
  getMedicationsTimeline() {
    return [
      { name: "Lisinopril 10mg", start_date: "2024-06-01", end_date: null, status: "active" },
      { name: "Vitamin D 2000 IU", start_date: "2024-08-15", end_date: null, status: "active" },
      { name: "Ibuprofen 400mg", start_date: "2024-03-01", end_date: "2024-05-15", status: "discontinued" },
    ];
  },

  // Vitals
  getVitals(patientId: number) {
    return vitalsData[patientId] || vitalsData[1];
  },

  // Appointments
  getAppointments(patientId?: number) {
    if (patientId) return appointments.filter(a => a.patient_id === patientId);
    return appointments;
  },
  bookAppointment(data: { patient_id: number; doctor_id: number; date: string; time: string; reason: string }) {
    const doc = doctors.find(d => d.id === data.doctor_id);
    const appt: Appointment = {
      id: nextId.appointment++,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      doctor_name: doc?.name || "Unknown Doctor",
      specialty: doc?.specialty || "",
      date: data.date,
      time: data.time,
      status: "upcoming",
      reason: data.reason,
    };
    appointments.push(appt);
    return appt;
  },
  cancelAppointment(appointmentId: number) {
    const appt = appointments.find(a => a.id === appointmentId);
    if (appt) appt.status = "cancelled";
    return appt;
  },

  // Patient Updates
  getPatientUpdates(patientId: number) {
    return patientUpdates.filter(u => u.patient_id === patientId);
  },
  getUpdateById(id: number) {
    return patientUpdates.find(u => u.id === id);
  },
  createPatientUpdate(data: { patient_id: number; text: string }) {
    const update: PatientUpdate = {
      id: nextId.update++,
      patient_id: data.patient_id,
      text: data.text,
      audio_url: null,
      ai_summary: `Patient reports: ${data.text.substring(0, 100)}...`,
      ai_questions: ["How are you feeling overall?", "Have there been any changes in your symptoms?"],
      created_at: new Date().toISOString(),
      replies: [],
    };
    patientUpdates.push(update);
    return update;
  },

  // Doctor Replies
  getDoctorReplies(patientId: number) {
    const updates = patientUpdates.filter(u => u.patient_id === patientId);
    return updates.flatMap(u => u.replies.map(r => ({ ...r, update_id: u.id, update_text: u.text })));
  },
  addDoctorReply(updateId: number, doctorId: number, text: string) {
    const update = patientUpdates.find(u => u.id === updateId);
    if (!update) return null;
    const doc = doctors.find(d => d.id === doctorId);
    const reply: DoctorReply = {
      id: nextId.reply++,
      doctor_id: doctorId,
      doctor_name: doc?.name || "Doctor",
      text,
      created_at: new Date().toISOString(),
    };
    update.replies.push(reply);
    return reply;
  },

  // Doctor Feed
  getDoctorFeed(doctorId: number) {
    // Return recent patient updates + consultation summaries
    const recentUpdates = patientUpdates.slice(-10).map(u => ({
      type: "patient_update" as const,
      id: u.id,
      patient_id: u.patient_id,
      patient_name: patients.find(p => p.id === u.patient_id)?.name || "Unknown",
      text: u.text,
      ai_summary: u.ai_summary,
      reply_count: u.replies.length,
      created_at: u.created_at,
    }));
    const recentConsults = consultations.map(c => ({
      type: "consultation" as const,
      id: c.id,
      patient_id: c.patient_id,
      patient_name: patients.find(p => p.id === c.patient_id)?.name || "Unknown",
      summary: c.summary,
      date: c.date,
    }));
    return [...recentUpdates, ...recentConsults].sort((a, b) => {
      const bTime = 'created_at' in b ? b.created_at : b.date;
      const aTime = 'created_at' in a ? a.created_at : a.date;
      return new Date(bTime || 0).getTime() - new Date(aTime || 0).getTime();
    });
  },

  // Consultations
  getConsultations(patientId?: number) {
    if (patientId) return consultations.filter(c => c.patient_id === patientId);
    return consultations;
  },

  // Billing
  getBillingRecords(patientId?: number) {
    if (patientId) return billingRecords.filter(b => b.patient_id === patientId);
    return billingRecords;
  },
  getBillingSummary() {
    const total = billingRecords.reduce((s, b) => s + b.amount, 0);
    const covered = billingRecords.reduce((s, b) => s + b.insurance_covered, 0);
    const outstanding = billingRecords.filter(b => b.status !== "paid").reduce((s, b) => s + b.patient_responsibility, 0);
    const pending = billingRecords.filter(b => b.status === "pending").length;
    return { total_billed: total, insurance_covered: covered, outstanding, pending_count: pending };
  },
  createBillingRecord(data: Partial<BillingRecord>) {
    const id = nextId.billing++;
    const record: BillingRecord = {
      id,
      patient_id: data.patient_id || 1,
      patient_name: data.patient_name || patients.find(p => p.id === data.patient_id)?.name || "Unknown",
      service: data.service || "",
      amount: data.amount || 0,
      insurance_covered: data.insurance_covered || 0,
      patient_responsibility: data.patient_responsibility || 0,
      status: data.status || "pending",
      date: data.date || new Date().toISOString().split("T")[0],
    };
    billingRecords.push(record);
    return record;
  },

  // Patient portal
  getPatientStatements(patientId: number) {
    return billingRecords.filter(b => b.patient_id === patientId).map(b => ({
      id: b.id, date: b.date, description: b.service, amount: b.patient_responsibility, status: b.status,
    }));
  },
  getPatientPayments(patientId: number) {
    return billingRecords.filter(b => b.patient_id === patientId && b.status === "paid").map(b => ({
      id: b.id, date: b.date, description: b.service, amount: b.patient_responsibility, method: "Credit Card",
    }));
  },
  getPatientInsurance(patientId: number) {
    const p = patients.find(pt => pt.id === patientId);
    if (!p) return null;
    return {
      provider: p.insurance_provider,
      member_id: p.insurance_id,
      group_number: p.group_number,
      plan_type: "PPO",
      coverage_start: "2024-01-01",
      copay: 25,
      deductible: 1500,
      deductible_met: 850,
    };
  },
};
