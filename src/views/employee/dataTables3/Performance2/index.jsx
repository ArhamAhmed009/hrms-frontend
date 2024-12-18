import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Container,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const PerformanceOverview = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [performanceDetails, setPerformanceDetails] = useState([]);
  const [progressToUpdate, setProgressToUpdate] = useState({});
  const [error, setError] = useState('');

  // Fetch all employees
  useEffect(() => {
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

  // Fetch performance data when employee is selected
  const fetchPerformanceData = async (employeeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/performance/${employeeId}/history`
      );
      setPerformanceDetails(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError('Error fetching performance data');
    }
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployeeId(employeeId);
    fetchPerformanceData(employeeId);
  };

  // Handle input change for progress update
  const handleProgressChange = (index, value) => {
    const updatedProgress = { ...progressToUpdate, [index]: value };
    setProgressToUpdate(updatedProgress);
  };

  // Update progress by employeeId
  const handleProgressUpdate = async (employeeId, index, goal) => {
    const progressValue = progressToUpdate[index] || 0;
    try {
      await axios.put(
        `http://localhost:5000/api/performance/${employeeId}/progress`,
        { progress: progressValue, goal }  // Ensure goal is sent with the request
      );
      fetchPerformanceData(employeeId); // Refresh performance data
      setError('');
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Error updating progress');
    }
  };

  // Find the highest overall score in the performance history
  const getHighestOverallScore = (history) => {
    if (!history || history.length === 0) return 0;
    return Math.round(Math.max(...history.map((item) => item.overallScore))); // Round off the score
  };

  // Prepare chart data
  const chartData = {
    labels: performanceDetails.map((record) =>
      new Date(record.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Overall Score Trend',
        data: performanceDetails.map((record) =>
          getHighestOverallScore(record.history)
        ),
        fill: false,
        borderColor: '#42a5f5',
        pointBackgroundColor: '#42a5f5',
        tension: 0.1,
      },
    ],
  };

  // Theme styling
  const bgColor = useColorModeValue('white', 'gray.800');
  const boxShadow = useColorModeValue('lg', 'dark-lg');
  const tableBorder = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading as="h2" textAlign="center" mb={6} fontSize="3xl">
          Employee Performance Overview
        </Heading>

        {/* Error Message */}
        {error && (
          <Text color="red.500" fontWeight="bold" textAlign="center">
            {error}
          </Text>
        )}

        {/* Employee Selector */}
        <Box bg={bgColor} p={6} borderRadius="md" boxShadow={boxShadow}>
          <Text fontSize="lg" mb={2} textAlign="center" fontWeight="medium">
            Select an Employee:
          </Text>
          <Select
            placeholder="Choose Employee"
            onChange={handleEmployeeChange}
            size="lg"
            mx="auto"
            maxW="sm"
            boxShadow="md"
            focusBorderColor="blue.500"
          >
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.employeeId}
              </option>
            ))}
          </Select>
        </Box>

        {/* Display Performance Details */}
        {performanceDetails.length > 0 ? (
          <Box bg={bgColor} p={4} borderRadius="md" boxShadow={boxShadow}>
            <Table variant="simple" size="md" borderColor={tableBorder}>
              <Thead>
                <Tr>
                  <Th>Goal</Th>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>Progress</Th>
                  <Th>Highest Overall Score</Th>
                  <Th>Update Progress</Th>
                </Tr>
              </Thead>
              <Tbody>
                {performanceDetails.map((perf, index) => (
                  <Tr key={perf._id}>
                    <Td>{perf.goal || 'Not specified'}</Td>
                    <Td>{perf.startDate ? new Date(perf.startDate).toLocaleDateString() : 'Invalid Date'}</Td>
                    <Td>{perf.endDate ? new Date(perf.endDate).toLocaleDateString() : 'Invalid Date'}</Td>
                    <Td>{perf.progress || 'Not available'}%</Td>
                    <Td>{getHighestOverallScore(perf.history)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Input
                          type="number"
                          value={progressToUpdate[index] || ''}
                          placeholder="Update"
                          onChange={(e) => handleProgressChange(index, e.target.value)}
                          maxW="80px"
                        />
                        <Button
                          colorScheme="blue"
                          onClick={() => handleProgressUpdate(selectedEmployeeId, index, perf.goal)}
                        >
                          Update
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Text textAlign="center" color="gray.500" fontSize="lg">
            No performance data available for the selected employee.
          </Text>
        )}

        {/* Performance Trend Chart */}
        <Box p={6} bg={bgColor} borderRadius="md" boxShadow={boxShadow}>
          <Line data={chartData} />
        </Box>
      </VStack>
    </Container>
  );
};

export default PerformanceOverview;
