import api from './api';

const authService = {
    register: async (email, password) => {
        const res = await api.post('/auth/register', { email, password });
        return res.data;
    },

    login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    },

    getCurrentUser: async () => {
        const res = await api.get('/auth/me');
        return res.data;
    }
};

export default authService;
