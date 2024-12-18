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
  Text
} from '@chakra-ui/react';
import axios from 'axios';

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const tableBg = useColorModeValue('gray.900', 'gray.800');
  const tableColor = useColorModeValue('white', 'gray.300');
  const headerBg = useColorModeValue('gray.700', 'gray.600');
  const buttonColorScheme = useColorModeValue('teal', 'blue');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

const handleToggleShortlist = async (candidateId, currentStatus) => {
  try {
    const updatedCandidate = await axios.put(`http://localhost:5000/api/candidates/${candidateId}/shortlist`, {
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
    <Box mt="40px" border="2px" borderColor="gray.300" borderRadius="12px" p="20px" bg={tableBg} color={tableColor}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Text fontSize="2xl" fontWeight="bold">Candidate List</Text>
      </Box>
      <TableContainer>
        <Table variant="simple" colorScheme="gray" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th textAlign="center">Candidate ID</Th>
              <Th textAlign="center">Name</Th>
              <Th textAlign="center">Position</Th>
              <Th textAlign="center">Experience (Years)</Th>
              <Th textAlign="center">Skills</Th>
              <Th textAlign="center">Education</Th>
              <Th textAlign="center">Status</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {candidates.map((candidate) => (
              <Tr key={candidate.candidateId}>
                <Td textAlign="center">{candidate.candidateId}</Td>
                <Td textAlign="center">{candidate.name}</Td>
                <Td textAlign="center">{candidate.position}</Td>
                <Td textAlign="center">{candidate.experience}</Td>
                <Td textAlign="center">{candidate.skills.join(', ')}</Td>
                <Td textAlign="center">{candidate.education}</Td>
                <Td textAlign="center">
                  {candidate.isShortlisted ? (
                    <Text color="green.400">Shortlisted</Text>
                  ) : (
                    <Text color="red.400">Not Shortlisted</Text>
                  )}
                </Td>
                <Td textAlign="center">
                  <Button
                    colorScheme={buttonColorScheme}
                    size="sm"
                    onClick={() => handleToggleShortlist(candidate.candidateId, candidate.isShortlisted)}  // Updated here
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
