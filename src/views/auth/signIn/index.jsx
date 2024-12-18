import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import DefaultAuth from "layouts/auth/Default";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleSignIn = async () => {
    try {
      const response = await fetch("https://taddhrms-0adbd961bf23.herokuapp.com/api/auth/login", { // Use Heroku URL here
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
  
      if (response.ok) {
        // Show success message
        toast({
          title: "Login Successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
  
        // Store token, employeeId, and role in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("employeeId", data.employee.employeeId);
        localStorage.setItem("role", data.employee.role);
  
        // Redirect based on role
        switch (data.employee.role) {
          case "HR Manager":
            navigate("/admin/default");
            break;
          case "Project Manager":
            navigate("/projectManager/default2");
            break;
          case "Employee":
            navigate("/employee/dashboard");
            break;
          default:
            navigate("/auth/signin");
        }
  
        window.location.reload();
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid email or password",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "An error occurred",
        description: "Unable to login. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  

  return (
    <DefaultAuth>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={useColorModeValue("navy.700", "white")} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color="gray.400"
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
              Email
            </FormLabel>
            <Input
              variant="auth"
              fontSize="sm"
              type="email"
              placeholder="mail@gmail.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <FormLabel fontSize="sm" fontWeight="500" mb="8px">
              Password
            </FormLabel>
            <InputGroup size="md">
              <Input
                fontSize="sm"
                placeholder="password"
                mb="24px"
                size="lg"
                type={show ? "text" : "password"}
                variant="auth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
              />
              <InputRightElement mt="4px">
                <Icon
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent="space-between" align="center" mb="24px">
              <Checkbox id="remember-login" colorScheme="brandScheme" me="10px" />
              <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal" fontSize="sm">
                Keep me logged in
              </FormLabel>
            </Flex>
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
