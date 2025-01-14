import React, { useState, useEffect } from "react";
import { 
  Box, 
  Input, 
  Button, 
  Stack, 
  Text, 
  useToast, 
  Heading, 
  HStack, 
  IconButton, 
  Checkbox, 
  FormControl, 
  FormLabel, 
  Divider 
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";

export default function AddSalary() {
  const [employeeId, setEmployeeId] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [isTaxFiler, setIsTaxFiler] = useState(false);
  const [salaryMonth, setSalaryMonth] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state


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
    taxDeduction: "",
    providentFund: "",
    otherDeductions: "",
  });
  const [otherAllowances, setOtherAllowances] = useState([{ name: "", value: "" }]);
  const [otherDeductions, setOtherDeductions] = useState([{ name: "", value: "" }]);
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Adjust tax rate based on tax filer status
    const taxRate = deductions.taxRate
    ? parseFloat(deductions.taxRate) / 100
    : isTaxFiler
    ? 0.06
    : 0.12; // User input overrides default
    const providentFundRate = deductions.providentFundRate
    ? parseFloat(deductions.providentFundRate) / 100
    : 0.05; // User input overrides default
    

    const calculatedTaxDeduction = baseSalary ? parseFloat(baseSalary) * taxRate : 0;
    const calculatedProvidentFund = baseSalary ? parseFloat(baseSalary) * providentFundRate : 0;
    
    setDeductions((prevDeductions) => ({
      ...prevDeductions,
      taxDeduction: calculatedTaxDeduction.toFixed(2),
      providentFund: calculatedProvidentFund.toFixed(2),
    }));
  }, [baseSalary, isTaxFiler]);

  const handleAddSalary = async () => {
    setIsLoading(true); // Start loader
  
    // Parse and merge allowances
    const customAllowances = otherAllowances.reduce((acc, allowance) => {
      if (allowance.name.trim()) {
        acc[allowance.name] = parseFloat(allowance.value) || 0; // Ensure parsing of values
      }
      return acc;
    }, {});
  
    // Parse and merge deductions
    const customDeductions = otherDeductions.reduce((acc, deduction) => {
      if (deduction.name.trim()) {
        acc[deduction.name] = parseFloat(deduction.value) || 0; // Ensure parsing of values
      }
      return acc;
    }, {});
  
    // Construct payload
    const salaryData = {
      employeeId: employeeId.trim(),
      baseSalary: parseFloat(baseSalary) || 0,
      allowances: {
        ...Object.fromEntries(
          Object.entries(allowances).map(([key, value]) => [key, parseFloat(value) || 0])
        ),
        ...customAllowances,
      },
      deductions: {
        ...Object.fromEntries(
          Object.entries(deductions).map(([key, value]) => [key, parseFloat(value) || 0])
        ),
        ...customDeductions,
      },
      isTaxFiler,
      providentFundRate: parseFloat(deductions.providentFundRate) || 0,
      taxRate: parseFloat(deductions.taxRate) || 0,
      salaryMonth, // Include the salaryMonth in the payload
    };
  
    console.log("Payload sent to API:", salaryData); // Debugging payload
  
    try {
      const response = await axios.post(
        "https://taddhrms-0adbd961bf23.herokuapp.com/api/salaries", // Updated to localhost
        salaryData
      );
      console.log("Salary added successfully:", response.data);
      setMessage(response.data.message || "Salary added successfully!"); // Display API response message
      toast({
        title: "Success!",
        description: response.data.message || "Salary added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Reset fields after successful submission
      resetFields();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "There was an issue adding the salary. Please try again."; // Extract API error message
      console.error("Error adding salary:", error);
      toast({
        title: "Error!",
        description: errorMessage, // Show specific API error message
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  
  
  // Reset function for clearing fields
  const resetFields = () => {
    setEmployeeId("");
    setBaseSalary("");
    setIsTaxFiler(false);
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
      providentFundRate: "",
      taxRate: "",
      otherDeductions: "",
    });
    setOtherAllowances([{ name: "", value: "" }]);
    setOtherDeductions([{ name: "", value: "" }]);
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
    <Box p="40px" bg="gray.50" boxShadow="lg" borderRadius="lg" maxW="700px" mx="auto" mt="8">
      <Stack spacing={6}>
        <Heading as="h1" size="lg" color="teal.600" textAlign="center">Add Employee Salary</Heading>
        <Divider />

        <Input
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          focusBorderColor="teal.500"
          variant="filled"
        />
<Input
  placeholder="Base Salary"
  value={baseSalary}
  onChange={(e) => setBaseSalary(e.target.value)}
  focusBorderColor="teal.500"
  variant="filled"
/>
<Input
  placeholder="Provident Fund Rate (%)"
  value={deductions.providentFundRate || ""} // Access from deductions state
  onChange={(e) => handleDeductionChange('providentFundRate', e.target.value)}
  focusBorderColor="teal.500"
  variant="filled"
/>
<Input
  placeholder="Tax Rate (%)"
  value={deductions.taxRate || ""} // Access from deductions state
  onChange={(e) => handleDeductionChange('taxRate', e.target.value)}
  focusBorderColor="teal.500"
  variant="filled"
/>
<FormControl>
  <select
    value={salaryMonth}
    onChange={(e) => setSalaryMonth(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #CBD5E0",
      fontSize: "16px",
    }}
  >
    <option value="">Select Month</option>
    <option value="January">January</option>
    <option value="February">February</option>
    <option value="March">March</option>
    <option value="April">April</option>
    <option value="May">May</option>
    <option value="June">June</option>
    <option value="July">July</option>
    <option value="August">August</option>
    <option value="September">September</option>
    <option value="October">October</option>
    <option value="November">November</option>
    <option value="December">December</option>
  </select>
</FormControl>



        {/* Tax Filer Checkbox with FormControl for better styling */}
        <FormControl display="flex" alignItems="center" p={4} bg="white" borderRadius="md" boxShadow="sm">
          <FormLabel htmlFor="tax-filer" mb="0" fontWeight="bold" color="teal.600">
            Tax Filer
          </FormLabel>
          <Checkbox
            id="tax-filer"
            isChecked={isTaxFiler}
            onChange={(e) => setIsTaxFiler(e.target.checked)}
            colorScheme="teal"
            size="lg"
          />
        </FormControl>

        {/* Allowances Section */}
        <Heading size="md" color="teal.600" mt={4}>Allowances</Heading>
        <Input placeholder="House Rent Allowance" value={allowances.houseRentAllowance} onChange={(e) => handleAllowanceChange('houseRentAllowance', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Medical Allowance" value={allowances.medicalAllowance} onChange={(e) => handleAllowanceChange('medicalAllowance', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Fuel Allowance" value={allowances.fuelAllowance} onChange={(e) => handleAllowanceChange('fuelAllowance', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Children Education Allowance" value={allowances.childrenEducationAllowance} onChange={(e) => handleAllowanceChange('childrenEducationAllowance', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Utilities Allowance" value={allowances.utilitiesAllowance} onChange={(e) => handleAllowanceChange('utilitiesAllowance', e.target.value)} focusBorderColor="teal.500" variant="filled" />

        {/* Other Allowances Section */}
        <Heading size="md" color="teal.600" mt={4}>Other Allowances</Heading>
        {otherAllowances.map((allowance, index) => (
          <HStack key={index} spacing={2}>
            <Input placeholder="Allowance Name" value={allowance.name} onChange={(e) => handleOtherAllowanceChange(index, 'name', e.target.value)} focusBorderColor="teal.500" variant="filled" />
            <Input placeholder="Allowance Value" value={allowance.value} onChange={(e) => handleOtherAllowanceChange(index, 'value', e.target.value)} focusBorderColor="teal.500" variant="filled" />
            <IconButton icon={<CloseIcon />} colorScheme="red" onClick={() => removeOtherAllowanceField(index)} />
          </HStack>
        ))}
        <Button onClick={addOtherAllowanceField} leftIcon={<AddIcon />} colorScheme="teal" variant="outline">
          Add Other Allowance
        </Button>

        {/* Deductions Section */}
        <Heading size="md" color="teal.600" mt={4}>Deductions</Heading>
        <Input placeholder="Professional Tax" value={deductions.professionalTax} onChange={(e) => handleDeductionChange('professionalTax', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Further Tax" value={deductions.furtherTax} onChange={(e) => handleDeductionChange('furtherTax', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Zakat" value={deductions.zakat} onChange={(e) => handleDeductionChange('zakat', e.target.value)} focusBorderColor="teal.500" variant="filled" />
        {/* <Input placeholder="Tax Deduction" value={deductions.taxDeduction} isReadOnly focusBorderColor="teal.500" variant="filled" />
        <Input placeholder="Provident Fund" value={deductions.providentFund} isReadOnly focusBorderColor="teal.500" variant="filled" /> */}

        {/* Other Deductions Section */}
        <Heading size="md" color="teal.600" mt={4}>Other Deductions</Heading>
        {otherDeductions.map((deduction, index) => (
          <HStack key={index} spacing={2}>
            <Input placeholder="Deduction Name" value={deduction.name} onChange={(e) => handleOtherDeductionChange(index, 'name', e.target.value)} focusBorderColor="teal.500" variant="filled" />
            <Input placeholder="Deduction Value" value={deduction.value} onChange={(e) => handleOtherDeductionChange(index, 'value', e.target.value)} focusBorderColor="teal.500" variant="filled" />
            <IconButton icon={<CloseIcon />} colorScheme="red" onClick={() => removeOtherDeductionField(index)} />
          </HStack>
        ))}
        <Button onClick={addOtherDeductionField} leftIcon={<AddIcon />} colorScheme="teal" variant="outline">
          Add Other Deduction
        </Button>

        <Button 
  colorScheme="teal" 
  onClick={handleAddSalary} 
  mt={4} 
  size="lg" 
  isLoading={isLoading} // Loader enabled
  loadingText="Saving"  // Optional: Text to show while loading
>
  Save Salary
</Button>


        {message && <Text color="green.500" fontWeight="bold" mt={4}>{message}</Text>}
      </Stack>
    </Box>
  );
}
