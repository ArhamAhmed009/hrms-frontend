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
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmployeesTable({ setDepartmentData, setTotalEmployees }) {
  const [employees, setEmployees] = useState([]);
  const tableBg = useColorModeValue("gray.900", "gray.800");
  const tableColor = useColorModeValue("white", "gray.300");
  const headerBg = useColorModeValue("gray.700", "gray.600");

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

  const updateAvailability = async (id, newAvailability) => {
    try {
      const response = await axios.put(
        `https://taddhrms-0adbd961bf23.herokuapp.com/api/employees/${id}/availability`,
        { availability: newAvailability }
      );
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === id ? response.data : employee
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  return (
    <Box
      mt="40px"
      border="2px"
      borderColor="gray.300"
      borderRadius="12px"
      p="20px"
      bg={tableBg}
      color={tableColor}
    >
      <Flex
        justifyContent="flex-end"
        alignItems="center"
        mb="20px"
      >
        <Button
          onClick={() => navigate('/admin/employee/add-employee')}
          colorScheme="teal"
          size="sm"
        >
          Add Employee
        </Button>
      </Flex>
      <TableContainer>
        <Table variant="simple" colorScheme="gray" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th textAlign="center">Employee ID</Th>
              <Th textAlign="center">Employee Name</Th>
              <Th textAlign="center">Position</Th>
              <Th textAlign="center">Designation</Th> {/* New field */}
              <Th textAlign="center">Department</Th>  {/* New field */}
              <Th textAlign="center">Phone Number</Th> {/* New field */}
              <Th textAlign="center">Availability</Th>
              <Th textAlign="center">Hire Date</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees.map((employee) => (
              <Tr key={employee._id}>
                <Td textAlign="center">{employee.employeeId}</Td>
                <Td textAlign="center">{employee.name}</Td>
                <Td textAlign="center">{employee.position}</Td>
                <Td textAlign="center">{employee.designation}</Td> {/* Display designation */}
                <Td textAlign="center">{employee.department}</Td> {/* Display department */}
                <Td textAlign="center">{employee.phoneNumber}</Td> {/* Display phone number */}
                <Td textAlign="center">{employee.availability}</Td>
                <Td textAlign="center">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </Td>
                <Td textAlign="center">
                  <Button
                    colorScheme="green"
                    size="xs"
                    onClick={() => updateAvailability(employee._id, "Available")}
                  >
                    Mark Available
                  </Button>
                  <Button
                    colorScheme="orange"
                    size="xs"
                    ml={2}
                    onClick={() => updateAvailability(employee._id, "Busy")}
                  >
                    Mark Busy
                  </Button>
                  <Button
                    colorScheme="red"
                    size="xs"
                    ml={2}
                    onClick={() => updateAvailability(employee._id, "On Leave")}
                  >
                    Mark On Leave
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
