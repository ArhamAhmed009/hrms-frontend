import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  Heading,
  Divider,
} from '@chakra-ui/react';
import axios from 'axios';

export default function LeaveRequest() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const toast = useToast();

  // Fetch employeeId from localStorage or from your Auth context
  const employeeId = localStorage.getItem('employeeId'); 

//   useEffect(() => {
//     if (employeeId) {
//       fetchLeaveRequests();
//     }
//   }, [employeeId]);

  // Fetch leave requests for the logged-in employee
//   const fetchLeaveRequests = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/leaves/${employeeId}`);
//       setLeaveRequests(response.data);
//     } catch (error) {
//       console.error('Error fetching leave requests:', error.message);
//       toast({
//         title: 'Error',
//         description: 'Could not fetch leave requests.',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

  // Submit a new leave request
  const handleRequestLeave = async () => {
    try {
      const requestData = {
        employeeId,
        leaveType,
        startDate,
        endDate,
        reason,
      };

      const response = await axios.post('http://localhost:5000/api/leaves/request', requestData);
      toast({
        title: 'Success',
        description: 'Leave request submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear form fields after successful submission
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      
      // Fetch updated leave requests
    //   fetchLeaveRequests();
    } catch (error) {
      console.error('Error submitting leave request:', error.message);
      toast({
        title: 'Error',
        description: 'Could not submit leave request.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="40px" bg="gray.50" boxShadow="lg" borderRadius="lg" maxW="600px" mx="auto" mt="8">
      <Heading size="lg" mb="4" textAlign="center" color="teal.600">
        Request Leave
      </Heading>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Leave Type</FormLabel>
          <Select
            placeholder="Select leave type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            focusBorderColor="teal.500"
          >
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Paid Leave">Paid Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            focusBorderColor="teal.500"
          />
        </FormControl>

        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            focusBorderColor="teal.500"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Reason</FormLabel>
          <Textarea
            placeholder="Enter reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            focusBorderColor="teal.500"
          />
        </FormControl>

        <Button colorScheme="teal" onClick={handleRequestLeave} size="lg">
          Submit Leave Request
        </Button>
      </Stack>

      <Divider my="8" />

      {/* <Heading size="md" mb="4" color="teal.600">
        My Leave Requests
      </Heading>
      {leaveRequests.length === 0 ? (
        <Text>No leave requests found.</Text>
      ) : (
        <Stack spacing={4}>
          {leaveRequests.map((leave) => (
            <Box key={leave._id} p={4} bg="white" borderRadius="md" boxShadow="md">
              <Text fontWeight="bold">Leave Type: {leave.leaveType}</Text>
              <Text>Start Date: {new Date(leave.startDate).toLocaleDateString()}</Text>
              <Text>End Date: {new Date(leave.endDate).toLocaleDateString()}</Text>
              <Text>Reason: {leave.reason}</Text>
              <Text>Status: {leave.status || 'Pending'}</Text>
            </Box>
          ))}
        </Stack>
      )} */}
    </Box>
  );
}
