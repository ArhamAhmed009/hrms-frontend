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
  useToast,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";

export default function TimeSheet() {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeSheets, setTimeSheets] = useState([]);
  const toast = useToast();

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
      checkInTime: new Date(`${date}T${startTime}`), // Combine date and start time
      checkOutTime: new Date(`${date}T${endTime}`),  // Combine date and end time
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
    <Box p="40px">
      <Stack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Add Time Sheet
        </Text>
        <Input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          type="time"
          placeholder="Check in"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          type="time"
          placeholder="Check out"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleAddTimeSheet}>
          Add Time Sheet
        </Button>

        <Text fontSize="2xl" fontWeight="bold" mt="20px" textAlign="center">
          Employee Time Sheets
        </Text>
        <Button onClick={fetchTimeSheets} colorScheme="teal">
          Fetch Time Sheets
        </Button>

        {timeSheets.length > 0 && (
          <Table variant="simple">
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
        )}
      </Stack>
    </Box>
  );
}
