// // src/context/AuthContext.jsx
// import React, { createContext, useEffect, useMemo, useState } from "react";
// import api from "../api";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   const refreshAuth = async () => {
//     try {
//       const res = await api.get("/auth/check-auth");
//       if (res.data?.isLoggedIn) setUser(res.data.user);
//       else setUser(null);
//     } catch {
//       setUser(null);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshAuth(); // ask server on app start
//   }, []);

//   // If the server ever returns 401, clear user
//   useEffect(() => {
//     const id = api.interceptors.response.use(
//       (r) => r,
//       (err) => {
//         if (err?.response?.status === 401) setUser(null);
//         return Promise.reject(err);
//       }
//     );
//     return () => api.interceptors.response.eject(id);
//   }, []);

//   const login = async (email, password) => {
//     await api.post("/auth/login", { email, password }); // sets cookie
//     await refreshAuth(); // re-sync
//   };

//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } finally {
//       setUser(null);
//     }
//   };

//   const value = useMemo(
//     () => ({ user, authLoading, login, logout, refreshAuth }),
//     [user, authLoading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// import api from "../api";
// // import React, { createContext, useEffect, useState } from "react";

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });

//   useEffect(() => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [user]);

//   const login = (userData) => setUser(userData);

//   // 🔧 use the shared axios instance, not fetch/localhost
//   const logout = async () => {
//     try {
//       await api.post("/auth/logout"); // withCredentials already true in api
//     } catch (err) {
//       console.error("Logout request failed:", err);
//     }
//     setUser(null);
//   };

//   // (optional) handy local-only clear to avoid hitting backend
//   const clearUser = () => setUser(null);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, clearUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

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
    refreshAuth(); // run once on app load
  }, []);

  // auto-clear user on 401s
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

  // Use this for form login
  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    await refreshAuth();
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  // Handy utilities when you already have user or want to clear locally
  const setUserDirect = (u) => setUser(u);
  const clearUser = () => setUser(null);

  const value = useMemo(
    () => ({ user, authLoading, login, logout, refreshAuth, setUserDirect, clearUser }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};