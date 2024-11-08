import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Adding request interceptor to include the Authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Adding response interceptor to handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem('authToken'); // Clear token if unauthorized
            const navigate = useNavigate();
            navigate("/login"); // Redirect to login page
        }
        return Promise.reject(error);
    }
);
