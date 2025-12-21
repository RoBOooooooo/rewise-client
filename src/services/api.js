import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor to add Firebase Token to all requests
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return null;

    const token = await firebaseUser.getIdToken();
    const payload = {
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        photo: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=' + (firebaseUser.displayName || 'User'),
        uid: firebaseUser.uid
    };

    return axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/${firebaseUser.email}`,
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export default api;
