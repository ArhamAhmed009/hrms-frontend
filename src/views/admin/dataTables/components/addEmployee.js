import React, { useState, useEffect } from "react";
import { Box, Input, Button, Stack, Text, Select, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [availability, setAvailability] = useState("Available"); // Default to "Available"
  const [hireDate, setHireDate] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("Employee"); // Default role
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
        toast({
          title: "Error",
          description: "Unable to fetch employee data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchEmployees();
  }, [toast]);

  const handleAddEmployee = async () => {
    if (!name || !position || !hireDate || !designation || !department || !phoneNumber || !role) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const employeeData = {
      employeeId,
      name,
      position,
      availability,
      hireDate,
      designation,
      department,
      phoneNumber,
      role,
    };

    try {
      const response = await axios.post("https://taddhrms-0adbd961bf23.herokuapp.com/api/employees", employeeData);
      console.log("Employee added successfully:", response.data);
      setMessage(`Employee added successfully! Email: ${response.data.email}, Password: ${response.data.password}`);

      toast({
        title: "Success",
        description: `Employee added successfully! Email: ${response.data.email}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate('/admin/employee');
    } catch (error) {
      console.error("Error adding employee:", error);
      setMessage("Error adding employee. Please try again.");

      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
        <Input placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
        <Input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <Input placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <Select placeholder="Select Role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Employee">Employee</option>
          <option value="HR Manager">HR Manager</option>
          <option value="Project Manager">Project Manager</option>
        </Select>
        <Button colorScheme="blue" onClick={handleAddEmployee}>Add Employee</Button>
        {message && <Text>{message}</Text>}
      </Stack>
    </Box>
  );
}