import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Divider,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

export default function AddCandidate() {
  const [candidateId, setCandidateId] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchLatestCandidateId = async () => {
      try {
        const response = await axios.get('https://taddhrms-0adbd961bf23.herokuapp.com/api/candidates');
        const candidates = response.data;

        if (candidates.length > 0) {
          const lastCandidate = candidates[candidates.length - 1];
          const lastIdNumber = parseInt(lastCandidate.candidateId.replace('C', ''), 10);
          const newId = `C${String(lastIdNumber + 1).padStart(3, '0')}`;
          setCandidateId(newId);
        } else {
          setCandidateId('C001');
        }
      } catch (error) {
        console.error('Error fetching latest candidate:', error);
        setMessage('Error fetching latest candidate');
      }
    };

    fetchLatestCandidateId();
  }, []);

  const handleAddCandidate = async () => {
    const formData = new FormData();
    formData.append('candidateId', candidateId);
    formData.append('name', name);
    formData.append('position', position);
    formData.append('experience', experience);
    formData.append('skills', skills.split(',').map(skill => skill.trim()));
    formData.append('education', education);
  
    if (resume) {
      formData.append('resume', resume);
    }
  
    // Debug FormData
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/candidates',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Candidate added successfully:', response.data);
  
      // Show success toast
      toast({
        title: "Candidate Added",
        description: "The candidate has been added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Reset form fields after successful submission
      setCandidateId('');
      setName('');
      setPosition('');
      setExperience('');
      setSkills('');
      setEducation('');
      setResume(null);
    } catch (error) {
      console.error('Error adding candidate:', error);
  
      // Show error toast
      toast({
        title: "Error",
        description: error.response?.data?.message || "There was an issue adding the candidate.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      console.log('Resume selected:', file);
    }
  };
  
  return (
    <Box p="40px" bg="gray.50" boxShadow="lg" borderRadius="lg" maxW="600px" mx="auto" mt="8">
      <Stack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold" color="teal.600" textAlign="center">Add New Candidate</Text>
        <Divider />

        <FormControl>
          <FormLabel>Candidate ID</FormLabel>
          <Input
            placeholder="Candidate ID"
            value={candidateId}
            isReadOnly
            focusBorderColor="teal.500"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            focusBorderColor="teal.500"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Position</FormLabel>
          <Input
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            focusBorderColor="teal.500"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Experience (Years)</FormLabel>
          <Input
            type="number"
            placeholder="Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            focusBorderColor="teal.500"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Skills (comma separated)</FormLabel>
          <Input
            placeholder="e.g. JavaScript, React, Node.js"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            focusBorderColor="teal.500"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Education</FormLabel>
          <Input
            placeholder="Education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            focusBorderColor="teal.500"
            variant="filled"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Upload Resume (PDF)</FormLabel>
          <Box position="relative">
            <label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                opacity="0"
                position="absolute"
                width="100%"
                height="100%"
                top="0"
                left="0"
                cursor="pointer"
                zIndex="2"
              />
              <Button as="span" colorScheme="teal" width="20%" zIndex="1">
                {resume ? resume.name : "Choose File"}
              </Button>
            </label>
          </Box>
        </FormControl>

        <Button colorScheme="teal" onClick={handleAddCandidate} size="lg">
          Add Candidate
        </Button>

        {message && <Text color="teal.600" fontWeight="bold" mt={4}>{message}</Text>}
      </Stack>
    </Box>
  );
}
