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

  // API URL for fetching employee-specific loans
  const API_URL = 'https://taddhrms-0adbd961bf23.herokuapp.com/api/loans';
  
  // Get employee details from localStorage
  const employeeId = localStorage.getItem('employeeId'); // e.g., "E090"
  const employeeName = localStorage.getItem('employeeName'); // e.g., "John Doe"

  // Fetch loan requests for the logged-in employee
  const fetchLoanRequests = async () => {
    if (!employeeId) {
      toast({
        title: 'Error',
        description: 'Employee ID not found. Please log in again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/employee/${employeeId}`);
      setLoanRequests(response.data);
    } catch (error) {
      console.error('Error fetching loan requests:', error.message);
      toast({
        title: 'Error',
        description: 'Could not fetch your loan requests.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Run fetchLoanRequests on component mount
  useEffect(() => {
    fetchLoanRequests();
  }, []);

  return (
    <Box p="6" maxW="1000px" mx="auto">
      <Heading mb="6" color="teal.600" textAlign="center">
        My Loan Requests
      </Heading>

      <Text fontWeight="bold" mb="4" color="teal.700">
        Employee: (ID: {employeeId || 'N/A'})
      </Text>

      {loading ? (
        <Spinner size="xl" mx="auto" display="block" />
      ) : loanRequests.length > 0 ? (
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Loan Amount</Th>
              <Th>Monthly Installment</Th>
              <Th>Remaining Balance</Th>
              <Th>Status</Th>
              <Th>Approved Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loanRequests.map((loan) => (
              <Tr key={loan._id}>
                <Td>{loan.loanAmount}</Td>
                <Td>{loan.monthlyInstallment}</Td>
                <Td>{loan.remainingBalance}</Td>
                <Td>
                  <Text
                    color={
                      loan.status === 'Approved'
                        ? 'green.500'
                        : loan.status === 'Rejected'
                        ? 'red.500'
                        : 'yellow.500'
                    }
                    fontWeight="bold"
                  >
                    {loan.status}
                  </Text>
                </Td>
                <Td>
                  {loan.approvedDate
                    ? new Date(loan.approvedDate).toLocaleDateString()
                    : 'N/A'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text textAlign="center" fontSize="lg" color="gray.500">
          No loan requests found.
        </Text>
      )}
    </Box>
  );
};

export default LoanManagementHR;
