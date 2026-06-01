import axios from 'axios';

const API = axios.create({
    baseURL: 'https://localhost:7070/api', // 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Jab bhi frontend se koi API hit hogi, ye local storage se token utha kar header mein bhej dega
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
