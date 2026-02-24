import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
    error: null,

    // Load User
    loadUser: async () => {
        try {
            if (localStorage.getItem('token')) {
                const res = await api.get('/auth/me');
                set({ user: res.data.data, isAuthenticated: true, loading: false });
            } else {
                set({ user: null, isAuthenticated: false, loading: false });
            }
        } catch (err) {
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, loading: false, error: err.response?.data?.error || 'Auth Error' });
        }
    },

    // Register User
    register: async (formData) => {
        try {
            set({ loading: true });
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            set({ token: res.data.token, user: res.data.data, isAuthenticated: true, loading: false, error: null });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.error || 'Registration failed', loading: false });
            return false;
        }
    },

    // Login User
    login: async (formData) => {
        try {
            set({ loading: true });
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            set({ token: res.data.token, user: res.data.data, isAuthenticated: true, loading: false, error: null });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.error || 'Login failed', loading: false });
            return false;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, loading: false });
    },

    // Clear Errors
    clearError: () => set({ error: null })
}));

export default useAuthStore;
