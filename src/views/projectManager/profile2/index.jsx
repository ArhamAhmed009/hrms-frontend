import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Stack,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import axios from "axios";

export default function Overview() {
  const [candidateId, setCandidateId] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [employers, setEmployers] = useState([]);
  const [selectedEmployers, setSelectedEmployers] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false); // State for select all checkbox

  
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const candidateResponse = await axios.get("http://localhost:5000/api/candidates");
        const shortlisted = candidateResponse.data.filter(candidate => candidate.isShortlisted);
        setShortlistedCandidates(shortlisted);

        const employerResponse = await axios.get("http://localhost:5000/api/employees/available");
        setEmployers(employerResponse.data);

        const interviewResponse = await axios.get("http://localhost:5000/api/interviews");
        setScheduledInterviews(interviewResponse.data);
        const lastInterview = interviewResponse.data[interviewResponse.data.length - 1];
        const lastInterviewId = lastInterview ? lastInterview.interviewId : "INT000";
        const newIdNumber = parseInt(lastInterviewId.replace("INT", "")) + 1;
        const newInterviewId = `INT${String(newIdNumber).padStart(3, "0")}`;
        setInterviewId(newInterviewId);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployers([]); // Deselect all
    } else {
      setSelectedEmployers([...employers]); // Select all
    }
    setSelectAll(!selectAll); // Toggle state
  };
  
  const handleEmployerSelection = (employer) => {
    if (selectedEmployers.includes(employer)) {
      setSelectedEmployers(selectedEmployers.filter((e) => e !== employer));
    } else {
      setSelectedEmployers([...selectedEmployers, employer]);
    }
  };
  
  const isConflict = (selectedDate, selectedTime) => {
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00.000Z`);
    for (let interview of scheduledInterviews) {
      const interviewDateTime = new Date(`${interview.date}T${interview.time}:00.000Z`);
      const timeDifference = (selectedDateTime - interviewDateTime) / (1000 * 60); // difference in minutes
      if (timeDifference > -30 && timeDifference < 30) {
        return true;
      }
    }
    return false;
  };

  const handleScheduleInterview = async () => {
    setError(null);

    // if (selectedEmployers.length < 3) {
    //   setError('There should be at least 3 employees in the panel.');
    //   return;
    // }

    if (isConflict(date, time)) {
      setErrorMessage('An interview is already scheduled within 30 minutes of this time.');
      setErrorModalOpen(true);
      return;
    }

    const interviewData = {
      candidateId,
      interviewId,
      position,
      date,
      time,
      employerPanel: selectedEmployers,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/interviews', interviewData);
      alert('Interview scheduled successfully!');
      setScheduledInterviews([...scheduledInterviews, response.data]);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setErrorModalOpen(true);
      } else {
        console.error('Error scheduling interview:', error);
        alert('Error scheduling interview.');
      }
    }
  };

  

  return (
    <Box p="40px">
      <Heading mb="20px">Schedule Interview</Heading>
      
      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb="20px">
        <Box>
          <Text>Candidate ID</Text>
          <Input
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            placeholder="Enter candidate ID"
            list="shortlistedCandidates"
          />
          <datalist id="shortlistedCandidates">
            {shortlistedCandidates.map(candidate => (
              <option key={candidate.candidateId} value={candidate.candidateId} />
            ))}
          </datalist>
        </Box>

        <Box>
          <Text>Interview ID</Text>
          <Input
            value={interviewId}
            isReadOnly
            placeholder="Interview ID will be generated automatically"
          />
        </Box>

        <Box>
          <Text>Position</Text>
          <Input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Enter position"
          />
        </Box>

        <Box>
          <Text>Date</Text>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Box>

        <Box>
          <Text>Time</Text>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Box>
      </Grid>

      {error && (
        <Alert status="error" mb="20px">
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Heading size="md" mb="10px">Employer Panel </Heading>
      <TableContainer>
        <Table variant="simple" size="md">
        <Thead>
  <Tr>
    <Th>
      <Checkbox
        isChecked={selectAll}
        onChange={handleSelectAll}
      >
        Select All
      </Checkbox>
    </Th>
    <Th>Employee ID</Th>
    <Th>Employee Name</Th>
    <Th>Position</Th>
  </Tr>
</Thead>
<Tbody>
  {employers.map((employer) => (
    <Tr key={employer._id}>
      <Td>
        <Checkbox
          isChecked={selectedEmployers.includes(employer)}
          onChange={() => handleEmployerSelection(employer)}
        />
      </Td>
      <Td>{employer.employeeId}</Td>
      <Td>{employer.name}</Td>
      <Td>{employer.position}</Td>
    </Tr>
  ))}
</Tbody>

        </Table>
      </TableContainer>

      <Stack spacing={4} mt="20px">
        <Button colorScheme="blue" onClick={handleScheduleInterview}>
          Schedule Interview
        </Button>
      </Stack>

      <Heading size="md" mt="40px" mb="10px">Scheduled Interviews</Heading>
      {scheduledInterviews.length > 0 ? (
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Interview ID</Th>
                <Th>Candidate ID</Th>
                <Th>Position</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Employer Panel</Th>
              </Tr>
            </Thead>
            <Tbody>
              {scheduledInterviews.map((interview) => (
                <Tr key={interview._id}>
                  <Td>{interview.interviewId}</Td>
                  <Td>{interview.candidateId}</Td>
                  <Td>{interview.position}</Td>
                  <Td>{new Date(interview.date).toLocaleDateString()}</Td>
                  <Td>{interview.time}</Td>
                  <Td>
                    {interview.employerPanel.map((employer) => (
                      <Text key={employer._id}>{employer.name} ({employer.position})</Text>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>No interviews scheduled yet.</Text>
      )}

      <AlertDialog
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Scheduling Conflict
            </AlertDialogHeader>
            <AlertDialogBody>
              {errorMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setErrorModalOpen(false)} colorScheme="blue">
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
