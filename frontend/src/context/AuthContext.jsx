import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);
        const payload = JSON.parse(
          atob(response.data.accessToken.split(".")[1]),
        );
        setUser({ id: payload.id, role: payload.role });
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    setAccessToken(response.data.accessToken);
    setUser({ role: response.data.role });
  };

  // NEW: Auto-login registration function
  const registerUser = async (email, password, role) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      role,
    });
    setAccessToken(response.data.accessToken);
    setUser({ role: response.data.role });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, registerUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
