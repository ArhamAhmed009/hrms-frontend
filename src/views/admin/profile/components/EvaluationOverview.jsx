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
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [finalDecision, setFinalDecision] = useState("");

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
      setEvaluation(response.data[0]); // Assuming you only want the first evaluation
      setFinalDecision(response.data[0].finalDecision);
    } catch (error) {
      setError(error.response?.data?.error || "Error fetching evaluation data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!evaluation) {
      setError("Please fetch an evaluation first.");
      return;
    }

    setPdfLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/evaluations/download/${evaluation._id}`, {
        responseType: "blob", // Important for downloading file
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `EvaluationReport_${evaluation._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      setError("Error downloading PDF.");
    } finally {
      setPdfLoading(false);
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

      {evaluation && (
        <Box>
          <VStack align="start" mb="6">
            <HStack spacing={3}>
              <Text fontWeight="bold" fontSize="lg">Evaluator ID:</Text>
              <Badge colorScheme="purple" fontSize="lg" px="4" py="1" borderRadius="md">
                {evaluation.evaluatorId}
              </Badge>
            </HStack>
          </VStack>

          <Divider my="6" />

          <Heading size="md" mb="4" color="gray.700">Evaluation Details</Heading>
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

          <Box mt="6">
            <Text><strong>Comments:</strong> {evaluation.comments || "N/A"}</Text>
            <Text><strong>Final Decision:</strong> {evaluation.finalDecision}</Text>
          </Box>

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

          <Stack mt="6" spacing={4}>
            <Button onClick={handleDownloadPDF} colorScheme="teal" isLoading={pdfLoading} width="full">
              Download PDF Report
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
