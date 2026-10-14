import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverUnavailable, setServerUnavailable] = useState(false);

  // Load user profile on startup; preserve session on transient network/503 errors
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setUser(null);
      setServerUnavailable(false);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      setServerUnavailable(false);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        // Token is genuinely invalid or expired
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setServerUnavailable(false);
      } else {
        // Network error, 503, or 5xx server downtime: keep token stored
        setServerUnavailable(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Automatically retry authentication when server status reports healthy
  useEffect(() => {
    const handleServerRecovered = () => {
      if (serverUnavailable && token) {
        loadUser();
      }
    };
    window.addEventListener("server:recovered", handleServerRecovered);
    return () => window.removeEventListener("server:recovered", handleServerRecovered);
  }, [serverUnavailable, token, loadUser]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    setServerUnavailable(false);
    return userData;
  };

  const register = async (data) => {
    const res = await api.post("/auth/register", data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    setServerUnavailable(false);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setServerUnavailable(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        serverUnavailable,
        retryAuth: loadUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;