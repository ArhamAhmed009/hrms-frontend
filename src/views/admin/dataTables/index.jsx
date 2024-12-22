import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useColorModeValue,
  Flex,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeesTable({ setDepartmentData, setTotalEmployees }) {
  const [employees, setEmployees] = useState([]);
  const tableBg = useColorModeValue("gray.50", "gray.800");
  const tableColor = useColorModeValue("gray.800", "white");
  const headerBg = useColorModeValue("teal.500", "teal.700");
  const headerColor = useColorModeValue("white", "gray.100");
  const buttonColorScheme = useColorModeValue("teal", "purple");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/employees");
        setEmployees(response.data);
        setTotalEmployees(response.data.length);
        calculateDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [setTotalEmployees]);

  const calculateDepartmentData = (employees) => {
    const departmentCounts = employees.reduce((acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(departmentCounts);
    const data = Object.values(departmentCounts);

    setDepartmentData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    });
  };

  return (
    <Box
      mt="40px"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      p="6"
      bg={tableBg}
      color={tableColor}
      shadow="lg"
    >
      <Flex justifyContent="flex-end" alignItems="center" mb="6">
        <Button
          onClick={() => navigate('/admin/employee/add-employee')}
          colorScheme={buttonColorScheme}
          size="sm"
          borderRadius="md"
        >
          Add Employee
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th textAlign="center" color={headerColor}>Employee ID</Th>
              <Th textAlign="center" color={headerColor}>Employee Name</Th>
              <Th textAlign="center" color={headerColor}>Position</Th>
              <Th textAlign="center" color={headerColor}>Designation</Th>
              <Th textAlign="center" color={headerColor}>Department</Th>
              <Th textAlign="center" color={headerColor}>Phone Number</Th>
              <Th textAlign="center" color={headerColor}>Availability</Th>
              <Th textAlign="center" color={headerColor}>Hire Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee) => (
              <Tr key={employee._id} _hover={{ bg: "gray.100" }}>
                <Td textAlign="center">
                  <Badge colorScheme="blue" px="3" py="1" borderRadius="full">
                    {employee.employeeId}
                  </Badge>
                </Td>
                <Td textAlign="center">{employee.name}</Td>
                <Td textAlign="center">{employee.position}</Td>
                <Td textAlign="center">{employee.designation}</Td>
                <Td textAlign="center">{employee.department}</Td>
                <Td textAlign="center">{employee.phoneNumber}</Td>
                <Td textAlign="center">
                  <Badge
                    colorScheme={
                      employee.availability === "Available"
                        ? "green"
                        : employee.availability === "Busy"
                        ? "yellow"
                        : "red"
                    }
                    px="3"
                    py="1"
                    borderRadius="full"
                  >
                    {employee.availability}
                  </Badge>
                </Td>
                <Td textAlign="center">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
