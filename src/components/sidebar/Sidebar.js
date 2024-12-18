import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Content from "components/sidebar/components/Content";
import {
  renderThumb,
  renderTrack,
  renderView,
} from "components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import PropTypes from "prop-types";
import { IoMenuOutline } from "react-icons/io5";

function Sidebar(props) {
  const { routes } = props;
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  // State to open confirmation dialog
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Logout handler function
  const handleLogout = () => {
    // Close the dialog and clear session
    setLogoutDialogOpen(false);
    localStorage.removeItem("token"); // Remove token or any session storage
    navigate("/auth/signin"); // Redirect to login page
  };

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  let sidebarBg = useColorModeValue("white", "navy.800");

  return (
    <Box display={{ sm: "none", xl: "block" }} w="100%" position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        {/* Sidebar content */}
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content routes={routes} />
        </Scrollbars>

        {/* Logout Button at the bottom */}
        <Box p="20px" borderTop="1px solid" borderColor="gray.200">
          <Button
            variant="solid"
            colorScheme="red"
            width="100%"
            onClick={() => setLogoutDialogOpen(true)}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to log out?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export function SidebarResponsive(props) {
  const { routes } = props;
  const sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const navigate = useNavigate();

  // Responsive logout handler with confirmation dialog
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color="gray.400"
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton zIndex="3" onClose={onClose} />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={routes} />
              {/* Logout Button in Responsive Sidebar */}
              <Box p="20px" borderTop="1px solid" borderColor="gray.200">
                <Button
                  variant="solid"
                  colorScheme="red"
                  width="100%"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  Logout
                </Button>
              </Box>
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Responsive Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={btnRef}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to log out?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={btnRef} onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
