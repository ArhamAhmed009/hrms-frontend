import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useColorModeValue,
  Text,
  Badge,
} from '@chakra-ui/react';
import axios from 'axios';

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const tableBg = useColorModeValue('gray.50', 'gray.800');
  const tableColor = useColorModeValue('gray.800', 'white');
  const headerBg = useColorModeValue('teal.500', 'teal.700');
  const headerColor = useColorModeValue('white', 'gray.100');
  const buttonColorScheme = useColorModeValue('teal', 'blue');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('https://taddhrms-0adbd961bf23.herokuapp.com/api/candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const handleToggleShortlist = async (candidateId, currentStatus) => {
    try {
      const updatedCandidate = await axios.put(`https://taddhrms-0adbd961bf23.herokuapp.com/api/candidates/${candidateId}/shortlist`, {
        isShortlisted: !currentStatus,  // Toggle the current status
      });

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.candidateId === candidateId ? updatedCandidate.data : candidate
        )
      );
    } catch (error) {
      console.error('Error toggling shortlist status:', error);
    }
  };

  return (
    <Box
      mt="40px"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      p="6"
      bg={tableBg}
      color={tableColor}
      shadow="lg"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="6">
        <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('teal.600', 'teal.200')}>
          Candidate List
        </Text>
      </Box>
      <TableContainer>
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th textAlign="center" color={headerColor}>Candidate ID</Th>
              <Th textAlign="center" color={headerColor}>Name</Th>
              <Th textAlign="center" color={headerColor}>Position</Th>
              <Th textAlign="center" color={headerColor}>Experience (Years)</Th>
              <Th textAlign="center" color={headerColor}>Skills</Th>
              <Th textAlign="center" color={headerColor}>Education</Th>
              <Th textAlign="center" color={headerColor}>Status</Th>
              <Th textAlign="center" color={headerColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {candidates.map((candidate) => (
              <Tr key={candidate.candidateId} _hover={{ bg: "gray.100" }}>
                <Td textAlign="center">
                  <Badge colorScheme="purple" px="3" py="1" borderRadius="full">
                    {candidate.candidateId}
                  </Badge>
                </Td>
                <Td textAlign="center">{candidate.name}</Td>
                <Td textAlign="center">{candidate.position}</Td>
                <Td textAlign="center">{candidate.experience}</Td>
                <Td textAlign="center">{candidate.skills.join(', ')}</Td>
                <Td textAlign="center">{candidate.education}</Td>
                <Td textAlign="center">
                  {candidate.isShortlisted ? (
                    <Badge colorScheme="green" px="2" py="1" borderRadius="md">
                      Shortlisted
                    </Badge>
                  ) : (
                    <Badge colorScheme="red" px="2" py="1" borderRadius="md">
                      Not Shortlisted
                    </Badge>
                  )}
                </Td>
                <Td textAlign="center">
                  <Button
                    colorScheme={buttonColorScheme}
                    size="sm"
                    onClick={() => handleToggleShortlist(candidate.candidateId, candidate.isShortlisted)}
                    borderRadius="md"
                  >
                    {candidate.isShortlisted ? 'Unshortlist' : 'Shortlist'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
