import React, { useState, useEffect } from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Allowances() {
  const { id } = useParams(); // Employee ID from URL
  const [allowances, setAllowances] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchAllowances = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/salaries/employee/${id}/allowances`);
        setAllowances(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching allowances',
          status: 'error',
          isClosable: true,
        });
      }
    };

    fetchAllowances();
  }, [id]); // Fetch data whenever the `id` changes

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="20px">Detailed Allowances</Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type of Allowance</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>House Rent Allowance</Td>
              <Td>${allowances.houseRentAllowance?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Medical Allowance</Td>
              <Td>${allowances.medicalAllowance?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Fuel Allowance</Td>
              <Td>${allowances.fuelAllowance?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Children Education Allowance</Td>
              <Td>${allowances.childrenEducationAllowance?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Utilities Allowance</Td>
              <Td>${allowances.utilitiesAllowance?.toFixed(2)}</Td>
            </Tr>
            <Tr>
              <Td>Other Allowance</Td>
              <Td>${allowances.otherAllowance?.toFixed(2)}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
