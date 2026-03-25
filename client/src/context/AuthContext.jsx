import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [skipValidation, setSkipValidation] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            if (token && !skipValidation) {
                try {
                    // Set default authorization header for all axios requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await axios.get('/api/auth/me');
                    setUser(res.data);
                } catch (err) {
                    console.error('Failed to load user', err);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token, skipValidation]);

    const login = async (userToken) => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setSkipValidation(false); // Reset validation flag
        // Set default authorization header for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        // Fetch user data
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (err) {
            console.error('Failed to load user after login', err);
            // If backend is not available, set a temporary user to allow navigation
            // This will be resolved when backend is available
            setUser({ id: 'temp', email: 'User' });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser, isAuthenticated: !!user, setSkipValidation }}>
            {children}
        </AuthContext.Provider>
    );
};
