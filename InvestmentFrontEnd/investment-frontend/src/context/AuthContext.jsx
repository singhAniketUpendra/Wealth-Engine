import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, refreshUserToken } from '../api/authApi';
import API from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (token && username && role) {
            setUser({ username, role });
        }
        setLoading(false);
    }, []);

    // 🔥 NEW COMPONENT ENGINE: Live State Parity Synchronization Helper
    const updateAuthUser = (updatedData) => {
        setUser((prev) => {
            if (!prev) return null;

            const freshUser = { ...prev, ...updatedData };

            // Sync local storage slots persistently to survive hard route updates
            if (updatedData.username) {
                localStorage.setItem('username', updatedData.username.trim());
            }
            if (updatedData.role) {
                localStorage.setItem('role', updatedData.role);
            }

            return freshUser;
        });
    };

    // 1. Login Function
    const login = async (email, password) => {
        try {
            const data = await loginUser({ email, password });

            // Store inside standard storage slots
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);

            const resolvedUid = data.userId !== undefined ? data.userId : (data.UserId !== undefined ? data.UserId : 1);
            localStorage.setItem('userId', resolvedUid);

            const activeUser = { username: data.username, role: data.role };
            setUser(activeUser);

            return { success: true, user: activeUser };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed. Check your connection.'
            };
        }
    };

    // 2. Logout Function
    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    // 3. Axios Interceptor Core Routing Pipeline
    useEffect(() => {
        const interceptor = API.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const accessToken = localStorage.getItem('token');
                        const refreshToken = localStorage.getItem('refreshToken');

                        const data = await refreshUserToken({ accessToken, refreshToken });

                        localStorage.setItem('token', data.token);
                        localStorage.setItem('refreshToken', data.refreshToken);

                        originalRequest.headers.Authorization = `Bearer ${data.token}`;
                        return API(originalRequest);
                    } catch (refreshError) {
                        logout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            API.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        /* 🔥 Inject updateAuthUser inside value cluster map layout */
        <AuthContext.Provider value={{ user, login, logout, loading, updateAuthUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
