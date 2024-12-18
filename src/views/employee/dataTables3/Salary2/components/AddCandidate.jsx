import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';

export default function AddCandidate() {
  const [candidateId, setCandidateId] = useState(''); // Store the new candidateId
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [resume, setResume] = useState(null); // For the resume file
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the latest candidate to get the last candidateId
    const fetchLatestCandidateId = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/candidates');
        const candidates = response.data;

        if (candidates.length > 0) {
          const lastCandidate = candidates[candidates.length - 1];
          const lastIdNumber = parseInt(lastCandidate.candidateId.replace('C', ''), 10);
          const newId = `C${String(lastIdNumber + 1).padStart(3, '0')}`;
          setCandidateId(newId);
        } else {
          setCandidateId('C001'); // If no candidates, start with C001
        }
      } catch (error) {
        console.error('Error fetching latest candidate:', error);
        setMessage('Error fetching latest candidate');
      }
    };

    fetchLatestCandidateId();
  }, []);

  const handleAddCandidate = async () => {
    const formData = new FormData(); // Create a FormData object

    // Append all form fields to FormData
    formData.append('candidateId', candidateId);
    formData.append('name', name);
    formData.append('position', position);
    formData.append('experience', experience);
    formData.append('skills', skills.split(',').map(skill => skill.trim()));
    formData.append('education', education);
    
    if (resume) {
      formData.append('resume', resume); // Append the file if it's selected
    }

    try {
      const response = await axios.post('http://localhost:5000/api/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is used
        },
      });
      console.log('Candidate added successfully:', response.data);
      setMessage('Candidate added successfully!');
    } catch (error) {
      console.error('Error adding candidate:', error);
      setMessage('Error adding candidate. Please try again.');
    }
  };

  return (
    <Box p="40px">
      <Stack spacing={4}>
        <Text fontSize="2xl">Add New Candidate</Text>

        <FormControl>
          <FormLabel>Candidate ID</FormLabel>
          <Input
            placeholder="Candidate ID"
            value={candidateId}
            isReadOnly
          />
        </FormControl>

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Position</FormLabel>
          <Input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Experience (Years)</FormLabel>
          <Input
            type="number"
            placeholder="Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Skills (comma separated)</FormLabel>
          <Input
            placeholder="e.g. JavaScript, React, Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Education</FormLabel>
          <Input
            placeholder="Education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
        </FormControl>

        {/* New field for uploading a resume */}
        <FormControl>
          <FormLabel>Upload Resume (PDF)</FormLabel>
          <Input
            type="file"
            accept="application/pdf" // Only accept PDF files
            onChange={(e) => setResume(e.target.files[0])} // Capture the uploaded file
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleAddCandidate}>
          Add Candidate
        </Button>

        {message && <Text>{message}</Text>}
      </Stack>
    </Box>
  );
}
