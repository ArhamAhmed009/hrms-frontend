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
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null); // For rejection modal
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const toast = useToast();

  const API_URL = 'https://taddhrms-0adbd961bf23.herokuapp.com/api/leaves';

  // Fetch all leave requests
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/requests`);
      setLeaves(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching leave requests.',
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

  // Handle status change
  const handleStatusChange = (leaveId, status) => {
    const leave = leaves.find((l) => l._id === leaveId);
    if (status === 'Rejected') {
      setSelectedLeave(leave); // Set current leave for rejection modal
      setShowModal(true);
    } else {
      updateLeaveStatus(leaveId, status);
    }
  };

  // Update leave status
  const updateLeaveStatus = async (leaveId, status, reason = '') => {
    try {
      const response = await axios.put(`${API_URL}/requests/${leaveId}/pm-approval`, {
        status,
        rejectionReason: reason,
      });
  
      const updatedLeave = response.data.leave; // Updated leave object from the API response
  
      // Update the specific leave item in the state
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === leaveId
            ? { ...leave, status: updatedLeave.status, projectManagerApproval: updatedLeave.projectManagerApproval }
            : leave
        )
      );
  
      toast({
        title: 'Leave status updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating status.',
        description: error.response?.data?.error || 'Unable to update the status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setShowModal(false);
      setRejectionReason('');
    }
  };
  

  // Submit rejection reason
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection reason required.',
        description: 'Please provide a reason for rejection.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    updateLeaveStatus(selectedLeave._id, 'Rejected', rejectionReason);
  };

  return (
    <Box p="40px" maxW="1200px" mx="auto">
      <VStack spacing={4} align="center" mb="10">
        <Heading as="h2" size="xl" color="teal.600" textAlign="center">
          Leave Management (PM)
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Approve or reject employee leave requests with ease.
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
                        {leave.employeeId?.name || leave.employeeId || 'Unknown Employee'}                        </Text>
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
      leave.projectManagerApproval === 'Approved'
        ? 'green'
        : leave.projectManagerApproval === 'Rejected'
        ? 'red'
        : 'gray'
    }
    p="8px"
    borderRadius="12px"
  >
    {leave.projectManagerApproval || 'Pending'}
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
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </Select>
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

      {/* Rejection Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter Rejection Reason</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleReject}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LeaveManagement;
