import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  Badge,
  useToast,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

export default function EmployeeDetailsPage() {
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState(localStorage.getItem("employeeId")); // From localStorage
  const [status, setStatus] = useState("");
  const [employeeDbId, setEmployeeDbId] = useState(""); // For the _id from the database
  const toast = useToast();

  // Fetch all employees to find the _id corresponding to the employeeId
  const fetchEmployeeDbId = async () => {
    try {
      const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/employees");
      const matchingEmployee = response.data.find((emp) => emp.employeeId === employeeId);
      if (matchingEmployee) {
        setEmployeeDbId(matchingEmployee._id); // Set the _id for further API calls
      } else {
        toast({
          title: "Error",
          description: "Employee not found in the database.",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error fetching employee _id:", error);
      toast({
        title: "Error fetching employee data",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  // Fetch employee details
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `https://taddhrms-0adbd961bf23.herokuapp.com/api/employees/${employeeId}`
        );
        setEmployee(response.data);
        setStatus(response.data.availability); // Set initial status
      } catch (error) {
        console.error("Error fetching employee details:", error);
        toast({
          title: "Error fetching employee details",
          description: error.message,
          status: "error",
          isClosable: true,
        });
      }
    };

    if (employeeId) {
      fetchEmployeeDetails();
      fetchEmployeeDbId(); // Fetch the _id from the database
    } else {
      toast({
        title: "No employee ID found in local storage",
        status: "error",
        isClosable: true,
      });
    }
  }, [employeeId, toast]);

  const updateStatus = async (newStatus) => {
    if (!employeeDbId) {
      toast({
        title: "Error",
        description: "Employee database ID (_id) is missing.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.put(
        `https://taddhrms-0adbd961bf23.herokuapp.com/api/employees/${employeeDbId}/availability`,
        { availability: newStatus }
      );
      setEmployee(response.data); // Update the employee state with the new data
      setStatus(newStatus); // Update the status
      toast({
        title: "Status updated successfully",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error updating status",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  if (!employee) {
    return (
      <Box textAlign="center" mt="40px">
        <Heading>Loading Employee Details...</Heading>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" p="6" bg="gray.50" rounded="lg" shadow="lg">
      <VStack spacing="4" align="stretch" mb="8">
        <HStack spacing="4" align="center">
          <Avatar size="xl" name={employee.name} />
          <Box>
            <Heading as="h1" size="lg" color="teal.500">
              {employee.name}
            </Heading>
            <Text fontSize="md" color="gray.600">
              Employee ID: <strong>{employee.employeeId}</strong>
            </Text>
            <Text fontSize="md" color="gray.600">
              Email: <strong>{employee.email}</strong>
            </Text>
            <Badge
              colorScheme={
                status === "Available"
                  ? "green"
                  : status === "Busy"
                  ? "orange"
                  : "red"
              }
              fontSize="0.9em"
              px="3"
              py="1"
              mt="2"
            >
              {status}
            </Badge>
          </Box>
        </HStack>

        <Divider />

        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Designation
          </Text>
          <Text fontSize="md" color="gray.600">
            {employee.designation || "N/A"}
          </Text>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Department
          </Text>
          <Text fontSize="md" color="gray.600">
            {employee.department || "N/A"}
          </Text>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Phone Number
          </Text>
          <Text fontSize="md" color="gray.600">
            {employee.phoneNumber || "N/A"}
          </Text>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Hire Date
          </Text>
          <Text fontSize="md" color="gray.600">
            {new Date(employee.hireDate).toLocaleDateString()}
          </Text>
        </Box>

        <Divider />

        <HStack justifyContent="center" spacing="4" mt="4">
          <Button
            colorScheme="green"
            onClick={() => updateStatus("Available")}
            isDisabled={status === "Available"}
          >
            Mark Available
          </Button>
          <Button
            colorScheme="orange"
            onClick={() => updateStatus("Busy")}
            isDisabled={status === "Busy"}
          >
            Mark Busy
          </Button>
          <Button
            colorScheme="red"
            onClick={() => updateStatus("On Leave")}
            isDisabled={status === "On Leave"}
          >
            Mark On Leave
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
