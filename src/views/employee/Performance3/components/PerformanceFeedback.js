import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const PerformanceFeedback = ({ overallScore, feedback }) => {
  return (
    <Box p={6} bg="gray.100" borderRadius="md" textAlign="center">
      <Text fontSize="2xl" fontWeight="bold">
        Overall Score: {overallScore}%
      </Text>
      <Text mt={4} fontSize="lg">
        {feedback}
      </Text>
    </Box>
  );
};

export default PerformanceFeedback;
