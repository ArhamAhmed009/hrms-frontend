import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Input, Button, Stack,Text } from '@chakra-ui/react';

import axios from 'axios';

const PerformanceTrend = ({ employeeId }) => {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    // Fetch performance records over time for the employee
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(`https://taddhrms-0adbd961bf23.herokuapp.com/api/performance/${employeeId}/history`);
        setPerformanceData(response.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    if (employeeId) fetchPerformanceData();
  }, [employeeId]);

  // Check if performance data exists
  if (!performanceData || performanceData.length === 0) {
    return <Text>No performance data available</Text>;
  }

  // Prepare the data for charting
  const trendData = {
    labels: performanceData.map((record) => new Date(record.date).toLocaleDateString()), // Labels are formatted dates
    datasets: [
      {
        label: 'Overall Score Trend',
        data: performanceData.map((record) => record.overallScore), // Overall scores for each date
        fill: false,
        borderColor: '#42a5f5',
        pointBackgroundColor: '#42a5f5',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <Box mt={8}>
      <Heading as="h3" size="md" mb={4}>Performance Trend</Heading>
      <Line data={trendData} options={options} />
    </Box>
  );
};

export default PerformanceTrend;
