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

export default function Deductions() {
  const [deductions, setDeductions] = useState({});
  const [totalDeductions, setTotalDeductions] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        // Fetch the employee ID from local storage
        const id = localStorage.getItem("employeeId");

        if (!id) {
          toast({
            title: "Employee ID not found",
            description: "Please log in or select an employee.",
            status: "warning",
            isClosable: true,
          });
          return;
        }

        const response = await axios.get(
          `https://taddhrms-0adbd961bf23.herokuapp.com/api/salaries/employee/${id}/deductions`
        );
        setDeductions(response.data.deductions);
        setTotalDeductions(response.data.totalDeductions);
      } catch (error) {
        toast({
          title: "Error fetching deductions",
          status: "error",
          isClosable: true,
        });
      }
    };

    fetchDeductions();
  }, [toast]); // Dependencies include toast

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb="20px">
        Detailed Deductions
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type of Deduction</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(deductions).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>${parseFloat(value || 0).toFixed(2)}</Td>
              </Tr>
            ))}
            <Tr>
              <Th>Total Deductions</Th>
              <Th>${totalDeductions.toFixed(2)}</Th>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
