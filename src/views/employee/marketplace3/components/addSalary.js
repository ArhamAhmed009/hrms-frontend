import React, { useState } from "react";
import { Box, Input, Button, Stack, Text, useToast, Heading, HStack, IconButton } from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function AddSalary() {
  const [employeeId, setEmployeeId] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [allowances, setAllowances] = useState({
    houseRentAllowance: "",
    medicalAllowance: "",
    fuelAllowance: "",
    childrenEducationAllowance: "",
    utilitiesAllowance: "",
    otherAllowance: "",
  });
  const [deductions, setDeductions] = useState({
    professionalTax: "",
    furtherTax: "",
    zakat: "",
    providentFund: "",
    otherDeductions: "",
  });
  const [otherAllowances, setOtherAllowances] = useState([{ name: "", value: "" }]); // Dynamic input fields for other allowances
  const [otherDeductions, setOtherDeductions] = useState([{ name: "", value: "" }]); // Dynamic input fields for other deductions
  const [message, setMessage] = useState("");
  const toast = useToast();  // Initialize toast hook

  const handleAddSalary = async () => {
    const totalOtherAllowances = otherAllowances.reduce((sum, allowance) => sum + (parseFloat(allowance.value) || 0), 0); // Calculate total of other allowances
    const totalOtherDeductions = otherDeductions.reduce((sum, deduction) => sum + (parseFloat(deduction.value) || 0), 0); // Calculate total of other deductions

    const salaryData = {
      employeeId,
      baseSalary: parseFloat(baseSalary),
      allowances: {
        houseRentAllowance: parseFloat(allowances.houseRentAllowance),
        medicalAllowance: parseFloat(allowances.medicalAllowance),
        fuelAllowance: parseFloat(allowances.fuelAllowance),
        childrenEducationAllowance: parseFloat(allowances.childrenEducationAllowance),
        utilitiesAllowance: parseFloat(allowances.utilitiesAllowance),
        otherAllowance: totalOtherAllowances, // Sum of all entered other allowances
      },
      deductions: {
        professionalTax: parseFloat(deductions.professionalTax),
        furtherTax: parseFloat(deductions.furtherTax),
        zakat: parseFloat(deductions.zakat),
        providentFund: parseFloat(deductions.providentFund),
        otherDeductions: totalOtherDeductions, // Sum of all entered other deductions
      },
    };

    try {
      const response = await axios.post("http://localhost:5000/api/salaries", salaryData);
      console.log("Salary added successfully:", response.data);
      setMessage("Salary added successfully!");
      toast({
        title: "Success!",
        description: "Salary added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear the input fields
      setEmployeeId("");
      setBaseSalary("");
      setAllowances({
        houseRentAllowance: "",
        medicalAllowance: "",
        fuelAllowance: "",
        childrenEducationAllowance: "",
        utilitiesAllowance: "",
        otherAllowance: "",
      });
      setDeductions({
        professionalTax: "",
        furtherTax: "",
        zakat: "",
        providentFund: "",
        otherDeductions: "",
      });
      setOtherAllowances([{ name: "", value: "" }]); // Clear other allowances
      setOtherDeductions([{ name: "", value: "" }]); // Clear other deductions

    } catch (error) {
      console.error("Error adding salary:", error);
      setMessage("Error adding salary. Please try again.");
      toast({
        title: "Error!",
        description: "There was an issue adding the salary. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAllowanceChange = (field, value) => {
    setAllowances((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeductionChange = (field, value) => {
    setDeductions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOtherAllowanceChange = (index, field, value) => {
    const newAllowances = [...otherAllowances];
    newAllowances[index][field] = value;
    setOtherAllowances(newAllowances);
  };

  const handleOtherDeductionChange = (index, field, value) => {
    const newDeductions = [...otherDeductions];
    newDeductions[index][field] = value;
    setOtherDeductions(newDeductions);
  };

  const addOtherAllowanceField = () => {
    if (otherAllowances.length < 4) {
      setOtherAllowances([...otherAllowances, { name: "", value: "" }]);
    } else {
      toast({
        title: "Limit reached",
        description: "You can only add up to 4 other allowances.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addOtherDeductionField = () => {
    if (otherDeductions.length < 4) {
      setOtherDeductions([...otherDeductions, { name: "", value: "" }]);
    } else {
      toast({
        title: "Limit reached",
        description: "You can only add up to 4 other deductions.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeOtherAllowanceField = (index) => {
    const newAllowances = [...otherAllowances];
    newAllowances.splice(index, 1);
    setOtherAllowances(newAllowances);
  };

  const removeOtherDeductionField = (index) => {
    const newDeductions = [...otherDeductions];
    newDeductions.splice(index, 1);
    setOtherDeductions(newDeductions);
  };

  return (
    <Box p="40px">
      <Stack spacing={4}>
        <Text fontSize="2xl">Add Salary</Text>

        <Input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <Input
          placeholder="Base Salary"
          value={baseSalary}
          onChange={(e) => setBaseSalary(e.target.value)}
        />

        {/* Allowances Section */}
        <Heading size="md" mt={4}>Allowances</Heading>
        <Input
          placeholder="House Rent Allowance"
          value={allowances.houseRentAllowance}
          onChange={(e) => handleAllowanceChange('houseRentAllowance', e.target.value)}
        />
        <Input
          placeholder="Medical Allowance"
          value={allowances.medicalAllowance}
          onChange={(e) => handleAllowanceChange('medicalAllowance', e.target.value)}
        />
        <Input
          placeholder="Fuel Allowance"
          value={allowances.fuelAllowance}
          onChange={(e) => handleAllowanceChange('fuelAllowance', e.target.value)}
        />
        <Input
          placeholder="Children Education Allowance"
          value={allowances.childrenEducationAllowance}
          onChange={(e) => handleAllowanceChange('childrenEducationAllowance', e.target.value)}
        />
        <Input
          placeholder="Utilities Allowance"
          value={allowances.utilitiesAllowance}
          onChange={(e) => handleAllowanceChange('utilitiesAllowance', e.target.value)}
        />

        {/* Other Allowances Section */}
        <Heading size="md" mt={4}>Other Allowances</Heading>
        {otherAllowances.map((allowance, index) => (
          <HStack key={index}>
            <Input
              placeholder="Allowance Name"
              value={allowance.name}
              onChange={(e) => handleOtherAllowanceChange(index, 'name', e.target.value)}
            />
            <Input
              placeholder="Allowance Value"
              value={allowance.value}
              onChange={(e) => handleOtherAllowanceChange(index, 'value', e.target.value)}
            />
            <IconButton
              icon={<CloseIcon />}
              colorScheme="red"
              onClick={() => removeOtherAllowanceField(index)}
            />
          </HStack>
        ))}
        <Button onClick={addOtherAllowanceField} leftIcon={<AddIcon />}>
          Add Other Allowance
        </Button>

        {/* Deductions Section */}
        <Heading size="md" mt={4}>Deductions</Heading>
        <Input
          placeholder="Professional Tax"
          value={deductions.professionalTax}
          onChange={(e) => handleDeductionChange('professionalTax', e.target.value)}
        />
        <Input
          placeholder="Further Tax"
          value={deductions.furtherTax}
          onChange={(e) => handleDeductionChange('furtherTax', e.target.value)}
        />
        <Input
          placeholder="Zakat"
          value={deductions.zakat}
          onChange={(e) => handleDeductionChange('zakat', e.target.value)}
        />
        <Input
          placeholder="Provident Fund"
          value={deductions.providentFund}
          onChange={(e) => handleDeductionChange('providentFund', e.target.value)}
        />

        {/* Other Deductions Section */}
        <Heading size="md" mt={4}>Other Deductions</Heading>
        {otherDeductions.map((deduction, index) => (
          <HStack key={index}>
            <Input
              placeholder="Deduction Name"
              value={deduction.name}
              onChange={(e) => handleOtherDeductionChange(index, 'name', e.target.value)}
            />
            <Input
              placeholder="Deduction Value"
              value={deduction.value}
              onChange={(e) => handleOtherDeductionChange(index, 'value', e.target.value)}
            />
            <IconButton
              icon={<CloseIcon />}
              colorScheme="red"
              onClick={() => removeOtherDeductionField(index)}
            />
          </HStack>
        ))}
        <Button onClick={addOtherDeductionField} leftIcon={<AddIcon />}>
          Add Other Deduction
        </Button>

        <Button colorScheme="blue" onClick={handleAddSalary} mt={4}>
          Save Salary
        </Button>

        {message && <Text>{message}</Text>}
      </Stack>
    </Box>
  );
}
