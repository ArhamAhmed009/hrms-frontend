import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, useColorModeValue, Text } from "@chakra-ui/react";
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, Tooltip, Legend } from 'chart.js';
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { MdAddTask, MdGroup, MdAssignment, MdEventNote } from "react-icons/md";
import axios from "axios";

// Register the components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, Tooltip, Legend);

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  // State for the data
  const [departmentData, setDepartmentData] = useState({ labels: [], datasets: [] });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [exitRecords, setExitRecords] = useState([]);
  const [weeklyTimesheetData, setWeeklyTimesheetData] = useState(0);
  const [monthlyTimesheetData, setMonthlyTimesheetData] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [performanceError, setPerformanceError] = useState(false);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/employees");
        const employees = response.data;

        // Calculate department-wise employee distribution
        const departmentCounts = employees.reduce((acc, employee) => {
          acc[employee.position] = (acc[employee.position] || 0) + 1;
          return acc;
        }, {});

        setDepartmentData({
          labels: Object.keys(departmentCounts),
          datasets: [
            {
              data: Object.values(departmentCounts),
              backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              ],
            },
          ],
        });

        // Set total employees count
        setTotalEmployees(employees.length);
      } catch (error) {
        console.error("Error fetching employees data:", error);
      }
    };

    const fetchExitRecords = async () => {
      try {
        const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/exits");
        setExitRecords(response.data);
      } catch (error) {
        console.error("Error fetching exit records:", error);
      }
    };

    const fetchTimesheetData = async () => {
      try {
        const weeklyResponse = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/timesheets/overall/weekly");
        const monthlyResponse = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/timesheets/overall/monthly");

        setWeeklyTimesheetData(weeklyResponse.data.totalHours || 0);
        setMonthlyTimesheetData(monthlyResponse.data.totalHours || 0);
      } catch (error) {
        console.error("Error fetching timesheet data:", error);
      }
    };

    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get("https://taddhrms-0adbd961bf23.herokuapp.com/api/performance/overview");
        setPerformanceData(response.data);
        setPerformanceError(false);
      } catch (error) {
        console.error("Error fetching performance data:", error);
        setPerformanceError(true); // Indicate an error occurred
      }
    };

    fetchEmployeeData();
    fetchExitRecords();
    fetchTimesheetData();
    fetchPerformanceData();
  }, []);

  // Prepare chart data for exit trends
  const exitTypes = ['Resignation', 'Retirement', 'Dismissal'];
  const exitCounts = exitTypes.map(type => exitRecords.filter(record => record.exitType === type).length);

  const exitChartData = {
    labels: exitTypes,
    datasets: [
      {
        label: 'Number of Exits',
        data: exitCounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Prepare line chart data for timesheet trends
  const timesheetChartData = {
    labels: ['Weekly Hours', 'Monthly Hours'],
    datasets: [
      {
        label: 'Timesheet Summary',
        data: [weeklyTimesheetData, monthlyTimesheetData],
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  // Prepare chart data for performance overview
  const performanceChartData = {
    labels: performanceData.map(record => record.employeeId),
    datasets: [
      {
        label: 'Overall Performance Score',
        data: performanceData.map(record => record.overallScore),
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px="20px">
      {/* Top Four Containers */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing="20px" mb="20px">
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)" icon={<MdAddTask size="28px" color="white" />} />}
          name="Total Employees"
          value={totalEmployees.toString()}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg={boxBg} icon={<MdGroup size="32px" color={brandColor} />} />}
          name="Departments"
          value={departmentData.labels.length.toString()}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg={boxBg} icon={<MdAssignment size="32px" color={brandColor} />} />}
          name="Open Positions"
          value="12"
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg, #FF8C00 0%, #FFD700 100%)" icon={<MdEventNote size="28px" color="white" />} />}
          name="Upcoming Reviews"
          value="24"
        />
      </SimpleGrid>

      {/* Department Distribution and Exit Trends */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        <Box bg={boxBg} border="2px" borderColor="gray.300" borderRadius="12px" p="20px" height="400px" display="flex" flexDirection="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold" mb="4">Department Distribution</Text>
          {departmentData.labels.length > 0 ? (
            <Pie data={departmentData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p>No department data available.</p>
          )}
        </Box>

        <Box bg={boxBg} border="2px" borderColor="gray.300" borderRadius="12px" p="20px" height="400px" display="flex" flexDirection="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold" mb="4">Exit Records Trends</Text>
          {exitRecords.length > 0 ? (
            <Bar data={exitChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p>No exit records available.</p>
          )}
        </Box>
      </SimpleGrid>

      {/* Timesheet Summary and Performance Overview */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" mt="20px">
        <Box bg={boxBg} border="2px" borderColor="gray.300" borderRadius="12px" p="20px" height="400px" display="flex" flexDirection="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold" mb="4">Timesheet Summary</Text>
          <Line data={timesheetChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>

        <Box bg={boxBg} border="2px" borderColor="gray.300" borderRadius="12px" p="20px" height="400px" display="flex" flexDirection="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold" mb="4">Performance Overview</Text>
          {performanceError ? (
            <Text color="red.500" fontSize="md" textAlign="center">No performance data available.</Text>
          ) : (
            performanceData.length > 0 ? (
              <Bar data={performanceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p>Loading performance data...</p>
            )
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
