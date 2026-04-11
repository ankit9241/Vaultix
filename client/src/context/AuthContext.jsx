import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Set default authorization header for all axios requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await axios.get("/api/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to load user", err);
          clearSession();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (userToken) => {
    localStorage.setItem("token", userToken);
    // Set default authorization header for all axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    // Fetch user data
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user after login", err);
      // If backend is not available, set a temporary user to allow navigation
      // This will be resolved when backend is available
      setUser({ id: "temp", email: "User" });
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
