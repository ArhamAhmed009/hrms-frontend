import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Select,
  Badge,
  Divider,
  VStack,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";

export default function EvaluationOverview() {
  const [candidateId, setCandidateId] = useState("");
  const [evaluations, setEvaluations] = useState([]); // Store all evaluations
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [finalDecision, setFinalDecision] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const handleFetchEvaluation = async () => {
    setError(null);
    setEvaluation(null);

    if (!candidateId) {
      setError("Please enter a candidate ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://taddhrms-0adbd961bf23.herokuapp.com/api/evaluations/candidate/${candidateId}`);
      setEvaluations(response.data); // Store all evaluations
      setFinalDecision(response.data[0]?.finalDecision || ""); // Set initial final decision
      
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching evaluation data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (evaluationId) => {
    setPdfLoading(evaluationId); // Start loader for the specific evaluation
    try {
      const response = await axios.get(
        `http://localhost:5000/api/evaluations/download/${evaluationId}`, // Use evaluationId in API call
        { responseType: "blob" } // Important for downloading file
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `EvaluationReport_${evaluationId}.pdf`); // Use evaluationId for file naming
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setError("Error downloading PDF.");
    } finally {
      setPdfLoading(null); // Reset loader state
    }
  };
  
  

  const handleUpdateFinalDecision = async (newDecision) => {
    if (!evaluation || !newDecision) return;

    setUpdateLoading(true);
    try {
      const response = await axios.put(
        `https://taddhrms-0adbd961bf23.herokuapp.com/api/evaluations/${evaluation._id}/final-decision`,
        { finalDecision: newDecision }
      );
      setEvaluation(response.data.evaluation);
      
      setError(null);
    } catch (error) {
      setError("Error updating final decision.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box p="40px" maxW="800px" mx="auto" bg="gray.50" borderRadius="md" shadow="md">
      <Heading mb="6" textAlign="center" color="teal.600">Evaluation Overview</Heading>

      <Box mb="6">
        <Text fontWeight="bold" color="gray.600">Candidate ID</Text>
        <Input
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          placeholder="Enter candidate ID"
          mb="4"
          borderColor="teal.400"
          focusBorderColor="teal.600"
        />
        <Button onClick={handleFetchEvaluation} colorScheme="teal" isLoading={loading} width="full">
          Fetch Evaluation
        </Button>
      </Box>

      {error && (
        <Alert status="error" mb="6" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

{evaluations.length > 0 && (
  <Box>
{evaluations.map((evaluation) => (
  <Box key={evaluation._id} mb="6" p="4" border="1px solid #CBD5E0" borderRadius="md">
    <VStack align="start">
      <HStack spacing={3}>
        <Text fontWeight="bold" fontSize="lg">Evaluator ID:</Text>
        <Badge colorScheme="purple" fontSize="lg" px="4" py="1" borderRadius="md">
          {evaluation.evaluatorId}
        </Badge>
      </HStack>
    </VStack>

    <Divider my="4" />

    <Heading size="sm" mb="2" color="gray.700">Evaluation Details</Heading>
    <TableContainer>
      <Table variant="simple" colorScheme="teal">
        <Thead bg="teal.100">
          <Tr>
            <Th>Criteria</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr><Td>Technical Skills</Td><Td>{evaluation.technicalSkills}</Td></Tr>
          <Tr><Td>Problem Solving</Td><Td>{evaluation.problemSolving}</Td></Tr>
          <Tr><Td>Behavioral Fit</Td><Td>{evaluation.behavioralFit}</Td></Tr>
          <Tr><Td>Cultural Fit</Td><Td>{evaluation.culturalFit}</Td></Tr>
          <Tr><Td>Communication Skills</Td><Td>{evaluation.communicationSkills}</Td></Tr>
          <Tr><Td>Adaptability</Td><Td>{evaluation.adaptability}</Td></Tr>
          <Tr><Td>Situational Judgment</Td><Td>{evaluation.situationalJudgment}</Td></Tr>
          <Tr><Td>Motivation & Interest</Td><Td>{evaluation.motivationInterest}</Td></Tr>
          <Tr><Td>Overall Impression</Td><Td>{evaluation.overallImpression}</Td></Tr>
        </Tbody>
      </Table>
    </TableContainer>

    <Box mt="4">
      <Text><strong>Comments:</strong> {evaluation.comments || "N/A"}</Text>
    </Box>

    <Button
      onClick={() => handleDownloadPDF(evaluation._id)} // Pass the specific _id
      colorScheme="teal"
      isLoading={pdfLoading === evaluation._id} // Loader for specific evaluation
      mt="4"
      width="full"
    >
      Download PDF Report
    </Button>
  </Box>
))}


    <Divider my="6" />

    <Box mt="6">
      <Text fontWeight="bold" color="gray.600">Update Final Decision</Text>
      <Select
        placeholder="Select final decision"
        value={finalDecision}
        onChange={(e) => {
          const newDecision = e.target.value;
          setFinalDecision(newDecision);
          handleUpdateFinalDecision(newDecision); // Automatically update when selected
        }}
        mb="4"
        borderColor="teal.400"
        focusBorderColor="teal.600"
        isDisabled={updateLoading}
      >
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
        <option value="On Hold">On Hold</option>
      </Select>
    </Box>
  </Box>
)}

    </Box>
  );
}
