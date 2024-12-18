import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("employeeRole"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setRole(localStorage.getItem("employeeRole"));
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, setRole, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
