import { create } from 'zustand';
import api from '../services/api';

export const useStore = create((set, get) => ({
  // Auth State
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  authLoading: false,
  authError: null,

  // Resume State
  resumes: [],
  resumesLoading: false,
  currentResume: null,
  activeReport: null,
  reportLoading: false,
  uploading: false,
  uploadError: null,

  // Matcher State
  currentJobMatch: null,
  jobMatchLoading: false,

  // AI Content State
  coverLetter: null,
  coverLetterLoading: false,
  interviewQuestions: [],
  interviewQuestionsLoading: false,
  bulletSuggestions: [],
  bulletLoading: false,

  // Chat State
  chatHistory: [],
  chatLoading: false,

  // Auth Actions
  register: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      await api.post('/auth/register', { email, password });
      set({ authLoading: false });
      return true;
    } catch (err) {
      set({ authLoading: false, authError: err.response?.data?.detail || 'Registration failed' });
      return false;
    }
  },

  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      
      // Fetch user profile details or extract from token
      // For simplicity, store email
      set({ 
        isAuthenticated: true, 
        authLoading: false,
        user: { email }
      });
      return true;
    } catch (err) {
      set({ authLoading: false, authError: err.response?.data?.detail || 'Invalid email or password' });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ 
      user: null, 
      isAuthenticated: false,
      resumes: [],
      currentResume: null,
      activeReport: null,
      currentJobMatch: null,
      coverLetter: null,
      interviewQuestions: [],
      chatHistory: []
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Decode JWT superficially to check user info
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        set({ isAuthenticated: true, user: { email: payload.email, id: payload.sub } });
      } catch (e) {
        get().logout();
      }
    } else {
      set({ isAuthenticated: false });
    }
  },

  // Resume Actions
  fetchResumes: async () => {
    set({ resumesLoading: true });
    try {
      const res = await api.get('/resumes');
      set({ resumes: res.data, resumesLoading: false });
    } catch (err) {
      set({ resumesLoading: false });
    }
  },

  uploadResume: async (file) => {
    set({ uploading: true, uploadError: null });
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set((state) => ({
        resumes: [res.data, ...state.resumes],
        currentResume: res.data,
        uploading: false
      }));
      return res.data;
    } catch (err) {
      set({ uploading: false, uploadError: err.response?.data?.detail || 'Upload failed' });
      return null;
    }
  },

  deleteResume: async (resumeId) => {
    try {
      await api.delete(`/resumes/${resumeId}`);
      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== resumeId),
        currentResume: state.currentResume?.id === resumeId ? null : state.currentResume,
        activeReport: state.currentResume?.id === resumeId ? null : state.activeReport
      }));
    } catch (err) {
      console.error("Failed to delete resume", err);
    }
  },

  selectResume: (resume) => {
    set({ currentResume: resume, activeReport: null, currentJobMatch: null, coverLetter: null, interviewQuestions: [] });
    if (resume && resume.status === 'Parsed') {
      get().fetchReport(resume.id);
    }
  },

  fetchReport: async (resumeId) => {
    set({ reportLoading: true, activeReport: null });
    try {
      const res = await api.get(`/analysis/report/${resumeId}`);
      set({ activeReport: res.data, reportLoading: false });
    } catch (err) {
      set({ reportLoading: false });
    }
  },

  // Job Match Actions
  matchJob: async (resumeId, jobTitle, jobDescription) => {
    set({ jobMatchLoading: true });
    try {
      const res = await api.post(`/analysis/match?resume_id=${resumeId}`, {
        job_title: jobTitle,
        job_description: jobDescription
      });
      set({ currentJobMatch: res.data, jobMatchLoading: false });
      return res.data;
    } catch (err) {
      set({ jobMatchLoading: false });
      return null;
    }
  },

  // AI Actions
  generateCoverLetter: async (resumeId, jobTitle, jobDescription) => {
    set({ coverLetterLoading: true, coverLetter: null });
    try {
      const res = await api.post(`/analysis/cover-letter?resume_id=${resumeId}`, {
        job_title: jobTitle,
        job_description: jobDescription
      });
      set({ coverLetter: res.data, coverLetterLoading: false });
    } catch (err) {
      set({ coverLetterLoading: false });
    }
  },

  generateInterviewQuestions: async (resumeId, jobTitle, jobDescription) => {
    set({ interviewQuestionsLoading: true, interviewQuestions: [] });
    try {
      const res = await api.post(`/analysis/interview-questions?resume_id=${resumeId}`, {
        job_title: jobTitle,
        job_description: jobDescription
      });
      set({ interviewQuestions: res.data.questions, interviewQuestionsLoading: false });
    } catch (err) {
      set({ interviewQuestionsLoading: false });
    }
  },

  rewriteBullet: async (bulletPoint, jobDescription) => {
    set({ bulletLoading: true, bulletSuggestions: [] });
    try {
      const res = await api.post('/analysis/rewrite-bullet', {
        bullet_point: bulletPoint,
        job_description: jobDescription
      });
      set({ bulletSuggestions: res.data.suggestions, bulletLoading: false });
    } catch (err) {
      set({ bulletLoading: false });
    }
  },

  // Chat Actions
  sendChatMessage: async (resumeId, message) => {
    const history = get().chatHistory;
    // Add temporary user message
    const userMsg = { role: 'user', content: message };
    set((state) => ({ 
      chatHistory: [...state.chatHistory, userMsg],
      chatLoading: true 
    }));
    
    try {
      const res = await api.post(`/analysis/chat?resume_id=${resumeId}`, {
        message,
        history
      });
      
      const assistantMsg = { role: 'assistant', content: res.data.reply };
      set((state) => ({ 
        chatHistory: [...state.chatHistory, assistantMsg],
        chatLoading: false 
      }));
    } catch (err) {
      set({ chatLoading: false });
    }
  },

  clearChat: () => {
    set({ chatHistory: [] });
  }
}));

// Set up expired session listener
if (typeof window !== 'undefined') {
  window.addEventListener('auth_session_expired', () => {
    useStore.getState().logout();
  });
}
