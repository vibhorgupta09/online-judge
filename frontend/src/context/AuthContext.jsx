// src/context/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import api from "../api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const res = await api.get("/auth/check-auth");
      if (res.data?.isLoggedIn) setUser(res.data.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth(); // ask server on app start
  }, []);

  // If the server ever returns 401, clear user
  useEffect(() => {
    const id = api.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err?.response?.status === 401) setUser(null);
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  const login = async (email, password) => {
    await api.post("/auth/login", { email, password }); // sets cookie
    await refreshAuth(); // re-sync
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, authLoading, login, logout, refreshAuth }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};