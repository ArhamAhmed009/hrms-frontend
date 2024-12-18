import React, { useState, useEffect } from "react";
import { Box, Input, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [availability, setAvailability] = useState("Available");  // Set to "Available" by default
  const [hireDate, setHireDate] = useState("");
  const [designation, setDesignation] = useState("");  // New Field
  const [department, setDepartment] = useState("");  // New Field
  const [phoneNumber, setPhoneNumber] = useState("");  // New Field
  const [message, setMessage] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/employees");
        const employees = response.data;
        if (employees.length > 0) {
          const latestEmployeeId = employees
            .map(emp => parseInt(emp.employeeId.replace(/[^\d]/g, ''), 10))
            .sort((a, b) => b - a)[0];
          setEmployeeId(`E${String(latestEmployeeId + 1).padStart(3, '0')}`);
        } else {
          setEmployeeId("E001");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    const employeeData = {
      employeeId,
      name,
      position,
      availability, // Will always be "Available"
      hireDate,
      designation,  // Added Field
      department,  // Added Field
      phoneNumber  // Added Field
    };

    try {
      const response = await axios.post("https://taddhrms-0adbd961bf23.herokuapp.com/api/employees", employeeData);
      console.log("Employee added successfully:", response.data);
      setMessage(`Employee added successfully! Email: ${response.data.email}, Password: ${response.data.password}`);
      navigate('/admin/employee');
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage("Error adding employee. Please try again.");
    }
  };

  return (
    <Box p="40px">
      <Stack spacing={4}>
        <Text fontSize="2xl">Add New Employee</Text>
        <Input placeholder="Employee ID" value={employeeId} isReadOnly />
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
        <Input
          placeholder="Availability"
          value={availability}
          isReadOnly // Make the availability input non-editable
        />
        <Input type="date" placeholder="Hire Date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
        <Input placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} /> {/* New Field */}
        <Input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} /> {/* New Field */}
        <Input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /> {/* New Field */}
        <Button colorScheme="blue" onClick={handleAddEmployee}>Add Employee</Button>
        {message && <Text>{message}</Text>}
      </Stack>
    </Box>
  );
}
