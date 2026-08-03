import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const[memberRole,setMemberRole] = useState('');
    const[userId,setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roleloading, setRoleLoading] = useState(true);
    const [user, setUser] = useState(null);
    const login = (newToken, memberRole, id) => {
        setToken(newToken);
        setMemberRole(memberRole);
        setUserId(id);
        setIsAuthenticated(true);
        // if (userData) setUser(userData);
    };
    const logout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {}, {
                withCredentials: true
            });
        } catch (error) {
            // console.error('logout error: ', error);
        }
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };
    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {}, {
                withCredentials: true
            });
            if (response.data.success) {
                // console.log('✅ Got new token from refresh');
                const newToken = response.data.accessToken;
                setToken(newToken);
                setIsAuthenticated(true);
                // console.log('New Token: ',newToken);
                if (response.data.user) {
                    setUser(response.data.user);
                }
            }
        } catch (error) {
            // console.log('❌ Refresh failed:', error.message);
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    const restoreSession = async () => {
        try {
            setRoleLoading(true);
            const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/me`,{},{withCredentials:true});
            const {data} = result;
            if(data.success){
                const member_role = data.member_role;
                setMemberRole(member_role);
            }
        } catch (error) {
            // console.log(error);
        }finally{
            setRoleLoading(false);
        }
    }
    useEffect(() => {
        const initAuth = async()=>{
            await checkAuth();
            await restoreSession();
        };
        initAuth();
    }, []);
    useEffect(() => {
        const interceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => axios.interceptors.request.eject(interceptor);
    }, [token]);
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {}, {
                            withCredentials: true
                        });

                        const newToken = response.data.accessToken;
                        setToken(newToken);
                        setIsAuthenticated(true);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        // console.log('❌ Auto-refresh failed, logging out');
                        logout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);
    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated,
            loading,
            roleloading,
            memberRole,
            userId,
            user,
            login,
            logout,
            checkAuth, // Optional: expose for manual refresh
            restoreSession
        }}>
            {children}
        </AuthContext.Provider>
    );
};
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}