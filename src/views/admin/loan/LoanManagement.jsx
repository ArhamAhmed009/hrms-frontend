import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Spinner,
  useToast,
  Heading,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';

const LoanManagementHR = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const API_URL = 'http://localhost:5000/api/loans';

  // Fetch all loan requests
  const fetchLoanRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/all-loan-requests`);
      setLoanRequests(response.data);
    } catch (error) {
      console.error('Error fetching loan requests:', error.message);
      toast({
        title: 'Error',
        description: 'Could not fetch loan requests.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  // Update loan status
  const updateLoanStatus = async (loanId, status) => {
    try {
      await axios.put(`${API_URL}/approve/${loanId}`, { status });
      toast({
        title: 'Success',
        description: `Loan status updated to ${status}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchLoanRequests();
    } catch (error) {
      console.error('Error updating loan status:', error.message);
      toast({
        title: 'Error',
        description: 'Could not update loan status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="6" maxW="1200px" mx="auto">
      <Heading mb="6" color="teal.600" textAlign="center">
        Loan Management Dashboard (HR)
      </Heading>
      {loading ? (
        <Spinner size="xl" mx="auto" display="block" />
      ) : (
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Employee ID</Th>
              <Th>Employee Name</Th>
              <Th>Position</Th>
              <Th>Loan Amount</Th>
              <Th>Monthly Installment</Th>
              <Th>Remaining Balance</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loanRequests.map((loan) => (
              <Tr key={loan._id}>
                <Td>{loan.employeeId}</Td>
                <Td>{loan.employeeName}</Td>
                <Td>{loan.position}</Td>
                <Td>{loan.loanAmount}</Td>
                <Td>{loan.monthlyInstallment}</Td>
                <Td>{loan.remainingBalance}</Td>
                <Td>{loan.status}</Td>
                <Td>
                  {loan.status === 'Approved' ? (
                    <Text color="green.500">Approved</Text>
                  ) : (
                    <Select
                      placeholder="Update Status"
                      onChange={(e) => updateLoanStatus(loan._id, e.target.value)}
                    >
                      <option value="Approved">Approve</option>
                      <option value="Rejected">Reject</option>
                    </Select>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default LoanManagementHR;
