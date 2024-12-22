import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Allowances() {
  const { id } = useParams(); // Employee ID from URL
  const [allowances, setAllowances] = useState({});
  const [totalAllowances, setTotalAllowances] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchAllowances = async () => {
      try {
        const response = await axios.get(
          `https://taddhrms-0adbd961bf23.herokuapp.com/api/salaries/employee/${id}/allowances`
        );
        setAllowances(response.data.allowances);
        setTotalAllowances(response.data.totalAllowances);
      } catch (error) {
        toast({
          title: "Error fetching allowances",
          status: "error",
          isClosable: true,
        });
      }
    };

    fetchAllowances();
  }, [id, toast]); // Fetch data whenever the `id` changes

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="20px">
        Detailed Allowances
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type of Allowance</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(allowances).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>${parseFloat(value || 0).toFixed(2)}</Td>
              </Tr>
            ))}
            <Tr>
              <Th>Total Allowances</Th>
              <Th>${totalAllowances.toFixed(2)}</Th>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
