import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";

const AuthContext = createContext();
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_STARTED_AT_KEY = "sessionStartedAt";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [skipValidation, setSkipValidation] = useState(false);
  const logoutTimerRef = useRef(null);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(SESSION_STARTED_AT_KEY);
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const getSessionStartTime = () => {
    const sessionStartedAt = Number(
      localStorage.getItem(SESSION_STARTED_AT_KEY),
    );
    if (Number.isFinite(sessionStartedAt) && sessionStartedAt > 0) {
      return sessionStartedAt;
    }

    const now = Date.now();
    localStorage.setItem(SESSION_STARTED_AT_KEY, String(now));
    return now;
  };

  const scheduleAutoLogout = (sessionStartedAt) => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    const expiresAt = sessionStartedAt + SESSION_DURATION_MS;
    const timeoutMs = expiresAt - Date.now();

    if (timeoutMs <= 0) {
      clearSession();
      return;
    }

    logoutTimerRef.current = setTimeout(() => {
      clearSession();
    }, timeoutMs);
  };

  const isSessionExpired = (sessionStartedAt) =>
    Date.now() - sessionStartedAt >= SESSION_DURATION_MS;

  useEffect(() => {
    const loadUser = async () => {
      if (token && !skipValidation) {
        const sessionStartedAt = getSessionStartTime();
        if (isSessionExpired(sessionStartedAt)) {
          clearSession();
          setLoading(false);
          return;
        }

        try {
          // Set default authorization header for all axios requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await axios.get("/api/auth/me");
          setUser(res.data);
          scheduleAutoLogout(sessionStartedAt);
        } catch (err) {
          console.error("Failed to load user", err);
          clearSession();
        }
      }
      setLoading(false);
    };

    loadUser();
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, [token, skipValidation]);

  const login = async (userToken) => {
    const sessionStartedAt = Date.now();
    localStorage.setItem("token", userToken);
    localStorage.setItem(SESSION_STARTED_AT_KEY, String(sessionStartedAt));
    setToken(userToken);
    setSkipValidation(false); // Reset validation flag
    // Set default authorization header for all axios requests
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    scheduleAutoLogout(sessionStartedAt);
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
        setSkipValidation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
