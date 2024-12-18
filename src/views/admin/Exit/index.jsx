import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';

const Exit = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [exitType, setExitType] = useState('Resignation');
  const [exitDate, setExitDate] = useState('');
  const [reason, setReason] = useState('');
  const [resignationFile, setResignationFile] = useState(null);
  const toast = useToast();

  const handleCreateExit = async () => {
    try {
      const formData = new FormData();
      formData.append('employeeId', employeeId);
      formData.append('exitType', exitType);
      formData.append('exitDate', exitDate);
      formData.append('reason', reason);
      if (exitType === 'Resignation' && resignationFile) {
        formData.append('resignationFile', resignationFile);
      }

      const response = await fetch('https://taddhrms-0adbd961bf23.herokuapp.com/api/exits/process-exit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Exit record created successfully',
          status: 'success',
          isClosable: true,
        });
        setEmployeeId('');
        setExitType('Resignation');
        setExitDate('');
        setReason('');
        setResignationFile(null);
      } else {
        throw new Error('Failed to create exit record');
      }
    } catch (error) {
      toast({
        title: 'Error creating exit record',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleFileChange = (event) => {
    setResignationFile(event.target.files[0]);
  };

  return (
    <Box maxWidth="800px" mx="auto" p="6">
      <Heading as="h1" mb="4" textAlign="center" color="teal.500">
        Employee Exit Management
      </Heading>
      <VStack spacing="4" align="stretch" mb="8" bg="white" p="6" rounded="md" shadow="md">
        <FormControl id="employeeId" isRequired>
          <FormLabel>Employee ID</FormLabel>
          <Input
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </FormControl>
        <FormControl id="exitType" isRequired>
          <FormLabel>Exit Type</FormLabel>
          <Select value={exitType} onChange={(e) => setExitType(e.target.value)}>
            <option value="Resignation">Resignation</option>
            <option value="Retirement">Retirement</option>
            <option value="Dismissal">Dismissal</option>
          </Select>
        </FormControl>
        <FormControl id="exitDate" isRequired>
          <FormLabel>Exit Date</FormLabel>
          <Input
            type="date"
            value={exitDate}
            onChange={(e) => setExitDate(e.target.value)}
          />
        </FormControl>
        {exitType === 'Resignation' && (
          <FormControl id="resignationFile">
            <FormLabel>Upload Resignation Document</FormLabel>
            <Input
              type="file"
              display="none"
              onChange={handleFileChange}
              id="fileInput"
            />
            <Button
              onClick={() => document.getElementById('fileInput').click()}
              colorScheme="teal"
              variant="outline"
              mt="2"
              width="full"
            >
              {resignationFile ? resignationFile.name : 'Choose File'}
            </Button>
          </FormControl>
        )}
        <FormControl id="reason">
          <FormLabel>Reason</FormLabel>
          <Textarea
            placeholder="Enter reason for exit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleCreateExit} width="full">
          Create Exit Record
        </Button>
      </VStack>
    </Box>
  );
};

export default Exit;
