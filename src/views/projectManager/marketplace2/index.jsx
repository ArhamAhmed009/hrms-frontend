import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  TableContainer,
  Text,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SalaryOverview() {
  const [salaries, setSalaries] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        // Get employee ID from local storage
        const employeeId = localStorage.getItem('employeeId');
        if (!employeeId) {
          toast({
            title: 'Error',
            description: 'Employee ID not found in local storage',
            status: 'error',
            isClosable: true,
          });
          return;
        }

        // Adjust API endpoint to match your route configuration
        const response = await axios.get(`http://localhost:5000/api/salaries/employee/${employeeId}/salaries`);
        setSalaries(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching salaries',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          isClosable: true,
        });
      }
    };

    fetchSalaries();
  }, [toast]);

  const handleGenerateSlip = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/salaries/${id}/salary-slip`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SalarySlip_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast({
        title: 'Error generating salary slip',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="20px">Employee Salaries</Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Employee ID</Th>
              <Th>Base Salary</Th>
              <Th>Total Allowances</Th>
              <Th>Total Deductions</Th>
              <Th>Salary Month</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {salaries.map((salary) => (
              <Tr key={salary._id}>
                <Td>{salary.employeeId.employeeId}</Td>
                <Td>${salary.baseSalary.toFixed(2)}</Td>
                <Td>
                  ${Object.values(salary.allowances || {})
                    .reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
                    .toFixed(2)}
                </Td>
                <Td>
                  ${Object.values(salary.deductions || {})
                    .reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
                    .toFixed(2)}
                </Td>
                <Td>{`${salary.salaryMonth}, ${salary.salaryYear}`}</Td>
                <Td>
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => handleGenerateSlip(salary._id)}
                  >
                    Generate Slip
                  </Button>
                  <Button
                    ml={2}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate(`/admin/salary/allowances/${salary.employeeId.employeeId}`)}
                  >
                    View Allowances
                  </Button>

                  <Button
                    ml={2}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => navigate(`/admin/salary/deductions/${salary.employeeId.employeeId}`)}
                  >
                    View Deductions
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
