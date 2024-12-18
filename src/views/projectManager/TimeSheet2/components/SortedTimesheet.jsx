import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa"; // Importing Font Awesome sync icon
import axios from "axios";

export default function SortedTimeSheets() {
  const [timeSheets, setTimeSheets] = useState([]);
  const toast = useToast();

  // Fetch sorted timesheets on component mount
  useEffect(() => {
    fetchSortedTimeSheets();
  }, []);

  // Fetch Sorted Time Sheets
  const fetchSortedTimeSheets = async () => {
    try {
      const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/timesheets");
      setTimeSheets(response.data);
    } catch (error) {
      toast({
        title: "Error fetching sorted timesheets",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box p="6" maxW="container.lg" mx="auto" boxShadow="lg" rounded="md" bg="white">
      <Stack spacing={6}>
        <Heading fontSize="2xl" fontWeight="bold" textAlign="center" color="teal.500">
          Sorted Employee Time Sheets
        </Heading>

        <Box display="flex" justifyContent="flex-end">
          <IconButton
            icon={<FaSyncAlt />}
            onClick={fetchSortedTimeSheets}
            colorScheme="teal"
            aria-label="Refresh Time Sheets"
            size="lg"
            variant="outline"
            isRound
            _hover={{ bg: "teal.100" }}
          />
        </Box>

        {timeSheets.length > 0 ? (
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Employee ID</Th>
                <Th>Date</Th>
                <Th>Check In</Th>
                <Th>Check Out</Th>
                <Th>Status</Th>
                <Th>Total Hours</Th>
                <Th>Is Short Leave</Th>
              </Tr>
            </Thead>
            <Tbody>
              {timeSheets.map((timeSheet) => (
                <Tr key={timeSheet._id}>
                  <Td>{timeSheet.employeeId}</Td>
                  <Td>{new Date(timeSheet.date).toLocaleDateString()}</Td>
                  <Td>
                    {timeSheet.checkInTime
                      ? new Date(timeSheet.checkInTime).toLocaleTimeString()
                      : "N/A"}
                  </Td>
                  <Td>
                    {timeSheet.checkOutTime
                      ? new Date(timeSheet.checkOutTime).toLocaleTimeString()
                      : "N/A"}
                  </Td>
                  <Td>{timeSheet.status || "N/A"}</Td>
                  <Td>{timeSheet.totalHours !== undefined ? timeSheet.totalHours : "N/A"}</Td>
                  <Td>{timeSheet.isShortLeave ? "Yes" : "No"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text textAlign="center" color="gray.500">
            No timesheets found.
          </Text>
        )}
      </Stack>
    </Box>
  );
}
