import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Select,
  Button,
  Spinner,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2"; // Import Bar chart from Chart.js
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

export default function EmployeeTimesheet() {
  const [employeeId, setEmployeeId] = useState(""); // Selected employee ID
  const [employeeList, setEmployeeList] = useState([]); // List of employees
  const [timesheetWeeklyData, setTimesheetWeeklyData] = useState([]);
  const [timesheetMonthlyData, setTimesheetMonthlyData] = useState([]);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch the list of employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployeeList(response.data);
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch employee-specific timesheet data for weekly and monthly reports
  const fetchTimesheetData = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      // Fetch weekly timesheet data for specific employee
      const weeklyResponse = await axios.get(
        `http://localhost:5000/api/timesheets/${employeeId}/weekly-report`
      );
      setTimesheetWeeklyData(weeklyResponse.data.timeSheets || []);
      setWeeklyHours(weeklyResponse.data.totalHours || 0);

      // Fetch monthly timesheet data for specific employee
      const monthlyResponse = await axios.get(
        `http://localhost:5000/api/timesheets/${employeeId}/monthly-report`
      );
      setTimesheetMonthlyData(monthlyResponse.data.timeSheets || []);
      setMonthlyHours(monthlyResponse.data.totalHours || 0);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for Weekly Bar Chart
  const weeklyChartData = {
    labels: timesheetWeeklyData.map(ts =>
      new Date(ts.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Hours Worked",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        data: timesheetWeeklyData.map(ts => ts.totalHours || 0),
      },
    ],
  };

  // Prepare data for Monthly Bar Chart
  const monthlyChartData = {
    labels: timesheetMonthlyData.map(ts =>
      new Date(ts.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Hours Worked",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
        data: timesheetMonthlyData.map(ts => ts.totalHours || 0),
      },
    ],
  };

  return (
    <Box pt="80px" px="20px">
      <Heading as="h2" size="lg" mb="6" textAlign="center">
        Employee Timesheet Report
      </Heading>

      {/* Employee Selector and Get Report Button */}
      <Flex alignItems="center" justifyContent="center" mb="30px">
        <Select
          placeholder="Select Employee"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          width="300px"
          mr="10px"
        >
          {employeeList.map((employee) => (
            <option key={employee.employeeId} value={employee.employeeId}>
              {employee.employeeId} - {employee.name}
            </option>
          ))}
        </Select>

        <Button
          colorScheme="blue"
          onClick={fetchTimesheetData}
          disabled={!employeeId || loading}
        >
          {loading ? <Spinner size="sm" /> : "Get Report"}
        </Button>
      </Flex>

      {/* Summary Cards for Total Weekly and Monthly Hours */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" mb="30px">
        <Box bg="blue.100" p="20px" borderRadius="12px" textAlign="center" boxShadow="lg">
          <FaClock size={30} color="blue" />
          <Text fontSize="xl" fontWeight="bold">
            Total Weekly Hours
          </Text>
          <Text fontSize="2xl" color="blue.600" mt="10px">
            {weeklyHours.toFixed(2)}
          </Text>
        </Box>
        <Box bg="yellow.100" p="20px" borderRadius="12px" textAlign="center" boxShadow="lg">
          <FaCalendarAlt size={30} color="goldenrod" />
          <Text fontSize="xl" fontWeight="bold">
            Total Monthly Hours
          </Text>
          <Text fontSize="2xl" color="yellow.600" mt="10px">
            {monthlyHours.toFixed(2)}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Timesheet Data Charts */}
      {employeeId && !loading && (
        <>
          {/* Weekly Timesheet Chart */}
          <Box bg="white" p="20px" borderRadius="12px" mb="20px" boxShadow="lg">
            <Text fontSize="lg" fontWeight="bold" color="blue.500" mb="10px">
              Weekly Timesheet Report
            </Text>
            <Bar
              data={weeklyChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Box>

          {/* Monthly Timesheet Chart */}
          <Box bg="white" p="20px" borderRadius="12px" boxShadow="lg">
            <Text fontSize="lg" fontWeight="bold" color="yellow.500" mb="10px">
              Monthly Timesheet Report
            </Text>
            <Bar
              data={monthlyChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Box>
        </>
      )}

      {/* Loading Spinner */}
      {loading && (
        <Flex justify="center" mt="20px">
          <Spinner size="xl" />
        </Flex>
      )}
    </Box>
  );
}
