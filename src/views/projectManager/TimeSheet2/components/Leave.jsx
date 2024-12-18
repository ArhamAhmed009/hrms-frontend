import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Stack,
  Heading,
  Text,
  useToast,
  Divider,
  Spinner,
  Flex,
  Badge,
  VStack,
  Icon,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch all leave requests
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://taddhrms-0adbd961bf23.herokuapp.com/api/leaves/requests');
      const leaveData = response.data.map((leave) => ({
        ...leave,
        status: leave.status || 'Pending', // Set default status to 'Pending'
      }));
      setLeaves(leaveData);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast({
        title: 'Error fetching data',
        description: 'Could not fetch leave requests.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <Box p="40px" maxW="1000px" mx="auto">
      <VStack spacing={4} align="center" mb="10">
        <Heading as="h2" size="xl" color="teal.600" textAlign="center">
          Leave Management
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Manage employee leave requests easily by reviewing their details here.
        </Text>
      </VStack>

      {loading ? (
        <Flex justify="center" mt="20px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table variant="striped" colorScheme="teal" mb="40px" size="lg">
          <Thead bg="teal.600">
            <Tr>
              <Th color="white" fontSize="lg">Employee</Th>
              <Th color="white" fontSize="lg">Start Date</Th>
              <Th color="white" fontSize="lg">End Date</Th>
              <Th color="white" fontSize="lg">Reason</Th>
              <Th color="white" fontSize="lg">Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaves.length > 0 ? (
              leaves.map((leave) => (
                <Tr key={leave._id}>
                  <Td>
                    <Flex align="center">
                      <Icon as={FaUserCircle} boxSize={6} color="teal.500" mr="10px" />
                      <Text fontWeight="bold" color="teal.600">
                        {leave.employeeId}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>{new Date(leave.startDate).toLocaleDateString()}</Td>
                  <Td>{new Date(leave.endDate).toLocaleDateString()}</Td>
                  <Td>{leave.reason}</Td>
                  <Td>
                    <Badge
                      fontSize="md"
                      colorScheme={
                        leave.status === 'Approved'
                          ? 'green'
                          : leave.status === 'Rejected'
                          ? 'red'
                          : 'yellow'
                      }
                      p="8px"
                      borderRadius="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minWidth="100px"
                    >
                      {leave.status}
                    </Badge>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="5">
                  <Text textAlign="center" fontSize="lg" color="gray.500" py="6">
                    No leave requests found.
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
      <Divider />
    </Box>
  );
};

export default LeaveManagement;
