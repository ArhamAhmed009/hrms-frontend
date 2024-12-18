import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  IconButton,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa"; // Font Awesome icon for refresh
import axios from "axios";

export default function TimeSheet() {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeSheets, setTimeSheets] = useState([]);
  const toast = useToast();

  // Fetch Employee ID from local storage on component mount
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    }
  }, []);

  // Fetch Time Sheets for a specific employee
  const fetchTimeSheets = async () => {
    try {
      const response = await axios.get(
        `https://taddhrms-0adbd961bf23.herokuapp.com/api/timesheets/${employeeId}`
      );
      setTimeSheets(response.data);
    } catch (error) {
      toast({
        title: "Error fetching timesheets",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        isClosable: true,
      });
    }
  };

  // Add new Time Sheet
  const handleAddTimeSheet = async () => {
    const timeSheetData = {
      employeeId,
      date,
      checkInTime: new Date(`${date}T${startTime}`),
      checkOutTime: new Date(`${date}T${endTime}`),
    };

    try {
      const response = await axios.post(
        "https://taddhrms-0adbd961bf23.herokuapp.com/api/timesheets",
        timeSheetData
      );
      toast({
        title: "Time Sheet added successfully!",
        status: "success",
        isClosable: true,
      });
      setTimeSheets([...timeSheets, response.data]);
    } catch (error) {
      toast({
        title: "Error adding Time Sheet",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box p="6" maxW="container.md" mx="auto" boxShadow="lg" rounded="md" bg="white">
      <Stack spacing={6}>
        <Heading fontSize="2xl" fontWeight="bold" textAlign="center" color="teal.500">
          Add Time Sheet
        </Heading>

        <FormControl id="employeeId" isReadOnly>
          <FormLabel>Employee ID</FormLabel>
          <Input
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </FormControl>

        <FormControl id="date">
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormControl>

        <FormControl id="checkInTime">
          <FormLabel>Check In Time</FormLabel>
          <Input
            type="time"
            placeholder="Check in"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </FormControl>

        <FormControl id="checkOutTime">
          <FormLabel>Check Out Time</FormLabel>
          <Input
            type="time"
            placeholder="Check out"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleAddTimeSheet}>
          Add Time Sheet
        </Button>

        <Heading fontSize="2xl" fontWeight="bold" textAlign="center" color="teal.500" mt="10">
          Employee Time Sheets
        </Heading>

        <Box display="flex" justifyContent="flex-end">
          <IconButton
            icon={<FaSyncAlt />}
            onClick={fetchTimeSheets}
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
