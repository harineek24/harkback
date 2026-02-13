export const API_BASE_URL = '';

export const WS_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
  : '';

export const endpoints = {
  // Health check
  health: () => `${API_BASE_URL}/api/medease/health`,

  // EHR Summarization
  summarize: () => `${API_BASE_URL}/api/medease/summarize`,
  extractMedications: () => `${API_BASE_URL}/api/medease/extract-medications`,
  extractPatientOverview: () => `${API_BASE_URL}/api/medease/extract-patient-overview`,
  extractTestResults: () => `${API_BASE_URL}/api/medease/extract-test-results`,
  medicationDetails: () => `${API_BASE_URL}/api/medease/medication-details`,
  analyzeMedications: () => `${API_BASE_URL}/api/medease/analyze-medications`,
  saveSummary: () => `${API_BASE_URL}/api/medease/save-summary`,

  // Dashboard & History
  dashboardStats: () => `${API_BASE_URL}/api/medease/dashboard/stats`,
  recentSummaries: () => `${API_BASE_URL}/api/medease/dashboard/recent-summaries`,
  recentConsultations: () => `${API_BASE_URL}/api/medease/dashboard/recent-consultations`,
  summaries: () => `${API_BASE_URL}/api/medease/summaries`,
  summaryById: (id: string) => `${API_BASE_URL}/api/medease/summaries/${id}`,
  consultations: () => `${API_BASE_URL}/api/medease/consultations`,
  consultationById: (id: string) => `${API_BASE_URL}/api/medease/consultations/${id}`,

  // Chat
  chat: () => `${API_BASE_URL}/api/medease/chat/general`,
  patientChat: () => `${API_BASE_URL}/api/medease/chat/patient`,

  // Voice Consultation
  voiceConfig: () => `${API_BASE_URL}/api/medease/voice/config`,
  voiceSession: (sessionId: string) => `${WS_BASE_URL}/ws/voice/${sessionId}`,
  consultationSessions: () => `${API_BASE_URL}/api/medease/consultation-sessions`,
  consultationSession: (id: string) => `${API_BASE_URL}/api/medease/consultation-sessions/${id}`,
};

export default endpoints;
