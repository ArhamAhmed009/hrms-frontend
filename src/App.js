import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './views/auth/signIn';
import AdminLayout from './layouts/admin';
import ProjectManagerLayout from './layouts/projectManager';
import EmployeeLayout from './layouts/employee';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [role, setRole] = useState(null);

  // Retrieve role from localStorage on component mount and on login
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Sign-In Route */}
        <Route path="auth/signin" element={<SignIn />} />

        {/* Conditionally render routes based on the user's role */}
        {role === "HR Manager" && (
          <Route
            path="admin/*"
            element={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />}
          />
        )}

        {role === "Project Manager" && (
          <Route
            path="projectManager/*"
            element={<ProjectManagerLayout theme={currentTheme} setTheme={setCurrentTheme} />}
          />
        )}

        {role === "Employee" && (
          <Route
            path="employee/*"
            element={<EmployeeLayout theme={currentTheme} setTheme={setCurrentTheme} />}
          />
        )}

        {/* Default redirect based on role */}
        <Route
          path="/"
          element={
            role === "HR Manager"
              ? <Navigate to="/admin/default" replace /> // Redirect to Admin for HR Manager
              : role === "Project Manager"
              ? <Navigate to="/projectManager/default2" replace /> // Redirect to Project Manager layout
              : role === "Employee"
              ? <Navigate to="/employee/dashboard" replace /> // Redirect to Employee layout
              : <Navigate to="/auth/signin" replace /> // Redirect to SignIn if no role is set
          }
        />

        {/* Catch-all route to redirect any unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
