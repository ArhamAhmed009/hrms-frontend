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
  FormControl,
  FormLabel,
  useToast,
  VStack,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const PerformanceMetrics = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedPerformanceId, setSelectedPerformanceId] = useState('');
  const [performanceRecords, setPerformanceRecords] = useState([]);
  const [attendanceScore, setAttendanceScore] = useState('');
  const [qualityScore, setQualityScore] = useState('');
  const [collaborationScore, setCollaborationScore] = useState('');
  const [overallScore, setOverallScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    // Fetch employees
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        setEmployees(response.data);
      } catch (error) {
        setError('Error fetching employees');
      }
    };
    fetchEmployees();
  }, []);

  // Fetch performance records based on employee selection
  const fetchPerformanceRecords = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/performance/${employeeId}`
      );
      setPerformanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching performance records:', error);
    }
  };

  const calculateOverallScore = async () => {
    if (!selectedPerformanceId) {
      toast({
        title: 'Select a performance goal',
        description: 'Please select a performance goal before calculating.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/performance/${selectedEmployeeId}/overall-score`,
        {
          attendanceScore: Number(attendanceScore),
          qualityScore: Number(qualityScore),
          collaborationScore: Number(collaborationScore),
          performanceId: selectedPerformanceId,
        }
      );
      setOverallScore(response.data.performance.overallScore);
      setFeedback(response.data.performance.feedback);
      toast({
        title: 'Success!',
        description: 'Overall score calculated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error calculating overall score:', error);
      setError('Error calculating overall score. Please try again.');
    }
  };

  return (
    <Container maxW="lg" py={10}>
      <Heading as="h2" mb={8} textAlign="center" color="teal.500">
        Employee Performance Metrics
      </Heading>

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <VStack spacing={6} align="start">
        <FormControl id="employee-select">
          <FormLabel fontWeight="bold" color="teal.600">
            Select Employee
          </FormLabel>
          <Select
            placeholder="Select Employee"
            onChange={(e) => {
              setSelectedEmployeeId(e.target.value);
              fetchPerformanceRecords(e.target.value); // Fetch performance records on employee selection
            }}
          >
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                Employee {emp.employeeId}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="performance-select">
          <FormLabel fontWeight="bold" color="teal.600">
            Select Performance Goal
          </FormLabel>
          <Select
            placeholder="Select Performance Goal"
            onChange={(e) => setSelectedPerformanceId(e.target.value)}
          >
            {performanceRecords.map((record) => (
              <option key={record._id} value={record._id}>
                {record.goal} (
                {new Date(record.startDate).toLocaleDateString()} -{' '}
                {new Date(record.endDate).toLocaleDateString()})
              </option>
            ))}
          </Select>
        </FormControl>

        <Divider />

        <Stack spacing={4} w="full">
          <FormControl id="attendance-score">
            <FormLabel>Attendance Score</FormLabel>
            <Input
              type="number"
              placeholder="Enter attendance score (0-100)"
              value={attendanceScore}
              onChange={(e) => setAttendanceScore(e.target.value)}
            />
          </FormControl>

          <FormControl id="quality-score">
            <FormLabel>Quality Score</FormLabel>
            <Input
              type="number"
              placeholder="Enter quality score (0-100)"
              value={qualityScore}
              onChange={(e) => setQualityScore(e.target.value)}
            />
          </FormControl>

          <FormControl id="collaboration-score">
            <FormLabel>Collaboration Score</FormLabel>
            <Input
              type="number"
              placeholder="Enter collaboration score (0-100)"
              value={collaborationScore}
              onChange={(e) => setCollaborationScore(e.target.value)}
            />
          </FormControl>

          <Button colorScheme="teal" onClick={calculateOverallScore}>
            Calculate Overall Score
          </Button>
        </Stack>

        {overallScore > 0 && (
          <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
            <Text fontSize="lg" fontWeight="bold">
              Overall Score: {overallScore}
            </Text>
            <Text fontSize="md" color="gray.600">
              Feedback: {feedback}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default PerformanceMetrics;
