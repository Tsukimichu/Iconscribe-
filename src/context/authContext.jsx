// src/context/authContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user immediately on first render (no flicker / no auto logout)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // Normalize user ID (very important)
        const normalized = {
          ...parsed,
          user_id: parsed.user_id || parsed.id, // ensure both exist
          id: parsed.id || parsed.user_id,
          token,
        };

        return normalized;
      } catch {
        return null;
      }
    }

    return null;
  });

  // Login function
  const login = (token, userData) => {
    // Normalize userData to always contain BOTH: id & user_id
    const normalized = {
      ...userData,
      user_id: userData.user_id || userData.id,
      id: userData.id || userData.user_id,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalized));

    setUser({ ...normalized, token });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);