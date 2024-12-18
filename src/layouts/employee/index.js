// EmployeeDashboard.js

import React, { useState } from "react";
import { useNavigate, Navigate, Route, Routes } from "react-router-dom";
import { Portal, Box, useDisclosure } from "@chakra-ui/react";
import Navbar from "components/navbar/NavbarAdmin"; // Replace with Navbar for Employee if available
import Sidebar from "components/sidebar/Sidebar";
import { SidebarContext } from "contexts/SidebarContext";
import employeeRoutes from "employeeRoutes"; // Ensure correct path

export default function EmployeeDashboard(props) {
  const { ...rest } = props;
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const getActiveRoute = () => {
    let activeRoute = 'Employee Dashboard';
    employeeRoutes.forEach((route) => {
      if (window.location.href.includes(route.layout + route.path)) {
        activeRoute = route.name;
      }
    });
    return activeRoute;
  };

  const getRoutes = () => {
    return employeeRoutes.map((route, key) => {
      if (route.layout === '/employee') {
        return <Route path={route.path} element={route.component} key={key} />;
      }
      return null;
    });
  };

  const { onOpen } = useDisclosure();

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={employeeRoutes} {...rest} />
        <Box float="right" minHeight="100vh" w={{ base: '100%', xl: 'calc( 100% - 290px )' }}>
          <Portal>
            <Navbar onOpen={onOpen} brandText={getActiveRoute()} {...rest} />
          </Portal>
          <Box p="20px" pt="50px">
            <Routes>
              {getRoutes()}
              <Route path="*" element={<Navigate to="default3" replace />} /> {/* Adjust default route */}
            </Routes>
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
