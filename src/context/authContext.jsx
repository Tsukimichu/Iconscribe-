// src/context/authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (token && id) {
      setUser({ id, role, token });
    }
  }, []);

  const login = (token, id, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", id);
    localStorage.setItem("role", role);
    setUser({ id, role, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
