import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Select,
  Input,
  Button,
  Stack,
  Container,
  Text,
  useToast,
} from '@chakra-ui/react';

const AddPerformance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const toast = useToast();

  // Fetch employees to populate the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://taddhrms-0adbd961bf23.herokuapp.com/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle form submission to add performance
  const handleAddPerformance = async () => {
    if (!selectedEmployeeId || !goal || !startDate || !endDate) {
      toast({
        title: 'All fields are required.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('https://taddhrms-0adbd961bf23.herokuapp.com/api/performance', {
        employeeId: selectedEmployeeId,
        goal,
        startDate,
        endDate,
      });

      toast({
        title: 'Performance added successfully!',
        description: `Goal: ${goal} for Employee ${selectedEmployeeId}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear the form
      setGoal('');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      console.error('Error adding performance:', error);
      toast({
        title: 'Error adding performance.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" centerContent>
      <Heading as="h2" mb={8} textAlign="center">
        Add Employee Performance
      </Heading>

      <Stack spacing={4} width="100%">
        <Select
          placeholder="Select Employee"
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          value={selectedEmployeeId}
        >
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              Employee {emp.employeeId}
            </option>
          ))}
        </Select>

        <Input
          type="text"
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button colorScheme="blue" onClick={handleAddPerformance}>
          Add Performance
        </Button>
      </Stack>
    </Container>
  );
};

export default AddPerformance;
