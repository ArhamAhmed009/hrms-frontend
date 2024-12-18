import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  TableContainer,
  Text,
  HStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const ExitRecords = () => {
  const [exits, setExits] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchExits = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exits');
        setExits(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching exits',
          description: error.response?.data?.message || 'An error occurred',
          status: 'error',
          isClosable: true,
        });
      }
    };
    fetchExits();
  }, [toast]);

  const handleGenerateReport = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/exits/report/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ExitReport_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: 'Error generating exit report',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleApproveExit = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/exits/${id}/approve`, {
        approvalStatus: 'Approved',
      });
      setExits((prevExits) =>
        prevExits.map((exit) =>
          exit._id === id ? { ...exit, approvalStatus: response.data.approvalStatus } : exit
        )
      );
      toast({
        title: 'Exit approved successfully',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error approving exit',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleRejectExit = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/exits/${id}/approve`, {
        approvalStatus: 'Rejected',
      });
      setExits((prevExits) =>
        prevExits.map((exit) =>
          exit._id === id ? { ...exit, approvalStatus: response.data.approvalStatus } : exit
        )
      );
      toast({
        title: 'Exit rejected successfully',
        status: 'error',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error rejecting exit',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb="4">Exit Records</Text>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Employee ID</Th>
              <Th>Exit Type</Th>
              <Th>Exit Date</Th>
              <Th>Remaining Salary</Th>
              <Th>Provident Fund</Th>
              <Th>Approval Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {exits.map((exit) => (
              <Tr key={exit._id}>
                <Td>{exit.employeeId?.employeeId || 'N/A'}</Td>
                <Td>{exit.exitType}</Td>
                <Td>{new Date(exit.exitDate).toLocaleDateString()}</Td>
                <Td>${exit.remainingSalary.toFixed(2)}</Td>
                <Td>${exit.providentFund.toFixed(2)}</Td>
                <Td>
                  <Badge colorScheme={
                    exit.approvalStatus === 'Approved' ? 'green' :
                    exit.approvalStatus === 'Rejected' ? 'red' : 'yellow'
                  }>
                    {exit.approvalStatus || 'Pending'}
                  </Badge>
                </Td>
                <Td>
                  {exit.exitType === 'Resignation' ? (
                    exit.approvalStatus === 'Approved' || exit.approvalStatus === 'Rejected' ? (
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => handleGenerateReport(exit._id)}
                      >
                        Generate Report
                      </Button>
                    ) : (
                      <HStack spacing="2">
                        <Button
                          colorScheme="green"
                          size="sm"
                          onClick={() => handleApproveExit(exit._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRejectExit(exit._id)}
                        >
                          Reject
                        </Button>
                      </HStack>
                    )
                  ) : (
                    <Button
                      colorScheme="teal"
                      size="sm"
                      onClick={() => handleGenerateReport(exit._id)}
                    >
                      Generate Report
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExitRecords;
