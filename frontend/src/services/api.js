import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const patientAPI = {
  submitAssessment: (data) => api.post('/assessment/initial-assessment', data),
  getDailyCheckins: () => api.get('/patient/daily-checkin'),
  submitDailyCheckin: (data) => api.post('/patient/daily-checkin', data),
  getProgress: () => api.get('/patient/progress'),
  getAppointments: () => api.get('/patient/appointments'),
  bookAppointment: (data) => api.post('/patient/book-appointment', data),
  triggerSOS: () => api.post('/patient/sos'),
};

export const professionalAPI = {
  getPatients: () => api.get('/professional/patients'),
  getPatientProfile: (patientId) => api.get(`/professional/patient/${patientId}/profile`),
  getAppointments: () => api.get('/professional/appointments'),
  updateAvailability: (data) => api.post('/professional/update-availability', data),
};

export const chatAPI = {
  getMessages: (userId) => api.get(`/chat/messages/${userId}`),
  getUnreadCount: () => api.get('/chat/messages/unread'),
  sendMessage: (data) => api.post('/chat/messages', data),
  getAISupport: (message) => api.post('/chat/ai-support', { message }),
};

export const meetingAPI = {
  findLocalMeetings: () => api.get('/meetings/local'),
  getMeetingDetails: (meetingId) => api.get(`/meetings/${meetingId}`),
};

export default api;
