import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Select,
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
import { FaCheckCircle, FaTimesCircle, FaUserCircle } from 'react-icons/fa';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch all leave requests
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/leaves/requests');
      const leaveData = response.data.map((leave) => ({
        ...leave,
        status: leave.status || '', // Initialize the status for each leave request
      }));
      setLeaves(leaveData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (leaveId, employeeId) => {
    const leaveToUpdate = leaves.find((leave) => leave._id === leaveId);
    try {
      await axios.put(`http://localhost:5000/api/leaves/requests/${employeeId}/status`, {
        status: leaveToUpdate.status,
      });
      fetchLeaves(); // Refresh leave data after updating status
      toast({
        title: 'Status updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast({
        title: 'Error updating status.',
        description: 'Unable to update the status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle status change for individual row
  const handleStatusChange = (leaveId, newStatus) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave._id === leaveId ? { ...leave, status: newStatus } : leave
      )
    );
  };

  return (
    <Box p="40px" maxW="1200px" mx="auto">
      <VStack spacing={4} align="center" mb="10">
        <Heading as="h2" size="xl" color="teal.600" textAlign="center">
          Leave Management
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Manage employee leave requests easily by updating their status here.
        </Text>
      </VStack>

      {loading ? (
        <Flex justify="center" mt="20px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Table variant="striped" colorScheme="teal" mb="40px" size="lg">
            <Thead bg="teal.500">
              <Tr>
                <Th color="white">Employee</Th>
                <Th color="white">Leave Type</Th>
                <Th color="white">Start Date</Th>
                <Th color="white">End Date</Th>
                <Th color="white">Reason</Th>
                <Th color="white">Status</Th>
                <Th color="white">Actions</Th>
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
                    <Td>{leave.leaveType}</Td>
                    <Td>{new Date(leave.startDate).toLocaleDateString()}</Td>
                    <Td>{new Date(leave.endDate).toLocaleDateString()}</Td>
                    <Td>{leave.reason}</Td>
                    <Td>
                      <Badge
                        fontSize="lg"
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
                        {leave.status || 'Pending'}
                      </Badge>
                    </Td>
                    <Td>
                      <Stack direction="row" align="center" spacing="4">
                        <Select
                          placeholder="Update Status"
                          value={leave.status}
                          width="150px"
                          borderRadius="10px"
                          onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                          bg="gray.100"
                        >
                          <option value="Approved">
                            <Flex align="center">
                              <Icon as={FaCheckCircle} mr="2" />
                              Approved
                            </Flex>
                          </option>
                          <option value="Rejected">
                            <Flex align="center">
                              <Icon as={FaTimesCircle} mr="2" />
                              Rejected
                            </Flex>
                          </option>
                        </Select>
                        <Button
                          colorScheme="teal"
                          onClick={() => handleStatusUpdate(leave._id, leave.employeeId)}
                          variant="solid"
                          borderRadius="8px"
                          _hover={{ bg: 'teal.600' }}
                        >
                          Update
                        </Button>
                      </Stack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="7">
                    <Text textAlign="center" fontSize="lg" color="gray.500">
                      No leave requests found.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>

          <Divider />
        </>
      )}
    </Box>
  );
};

export default LeaveManagement;
