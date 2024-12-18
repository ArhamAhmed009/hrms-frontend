import React, { useState, useEffect } from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Deductions() {
  const { id } = useParams(); // Employee ID
  const [deductions, setDeductions] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        // Updated API route to fetch only deductions by employeeId
        const response = await axios.get(`https://taddhrms-0adbd961bf23.herokuapp.com/api/salaries/employee/${id}/deductions`);
        setDeductions(response.data); // We are assuming the API returns only the deductions
      } catch (error) {
        toast({
          title: 'Error fetching deductions',
          status: 'error',
          isClosable: true,
        });
      }
    };

    fetchDeductions();
  }, [id, toast]);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="20px">Detailed Deductions</Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type of Deduction</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Professional Tax</Td>
              <Td>${deductions.professionalTax?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Further Tax</Td>
              <Td>${deductions.furtherTax?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Zakat</Td>
              <Td>${deductions.zakat?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Provident Fund</Td>
              <Td>${deductions.providentFund?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Other Deductions</Td>
              <Td>${deductions.otherDeductions?.toFixed(2)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
