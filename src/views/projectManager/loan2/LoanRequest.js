import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  useToast,
  Textarea,
  Stack,
} from '@chakra-ui/react';
import axios from 'axios';

const LoanRequest = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [reason, setReason] = useState('');
  const toast = useToast();

  const employeeId = localStorage.getItem('employeeId') || 'E092'; // Replace for testing
  const API_URL = 'https://taddhrms-0adbd961bf23.herokuapp.com/api/loans';

  const handleSubmit = async () => {
    try {
      const requestData = {
        employeeId,
        loanAmount: Number(loanAmount),
        monthlyInstallment: Number(monthlyInstallment),
        reason,
      };
      await axios.post(`${API_URL}/create`, requestData);
      toast({
        title: 'Success',
        description: 'Loan request submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setLoanAmount('');
      setMonthlyInstallment('');
      setReason('');
    } catch (error) {
      console.error('Error submitting loan request:', error.message);
      toast({
        title: 'Error',
        description: 'Could not submit loan request.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p="6" maxW="600px" mx="auto" boxShadow="lg" borderRadius="md" bg="gray.50" mt="10">
      <Heading mb="6" color="teal.600" textAlign="center">
        Loan Request Form
      </Heading>
      <Stack spacing="4">
        <FormControl>
          <FormLabel>Loan Amount</FormLabel>
          <Input
            type="number"
            placeholder="Enter loan amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Monthly Installment</FormLabel>
          <Input
            type="number"
            placeholder="Enter monthly installment"
            value={monthlyInstallment}
            onChange={(e) => setMonthlyInstallment(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Reason</FormLabel>
          <Textarea
            placeholder="Enter reason for loan"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="teal" size="lg" onClick={handleSubmit}>
          Submit Loan Request
        </Button>
      </Stack>
    </Box>
  );
};

export default LoanRequest;
