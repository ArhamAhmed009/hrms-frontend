/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
  const { routes } = props;
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const activeRoute = (routeName) => location.pathname.includes(routeName);

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // Skip routes if needed
      if (
        route.path === "/employee/add-employee" ||
        route.path.includes("/salary/allowances") ||
        route.path.includes("/salary/deductions")
      ) {
        return null;
      }

      if (route.category) {
        return (
          <React.Fragment key={index}>
            <Text
              fontSize="md"
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt="18px"
              pb="12px"
            >
              {route.name}
            </Text>
            {createLinks(route.items)}
          </React.Fragment>
        );
      } else if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl" ||
        route.layout === "/projectManager" || // Added condition for projectManager layout
        route.layout === "/employee" // Added condition for projectManager layout
      ) {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            <Box>
              <HStack
                spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
                py="5px"
                ps="10px"
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  <Box
                    color={
                      activeRoute(route.path.toLowerCase()) ? activeIcon : textColor
                    }
                    me="18px"
                  >
                    {route.icon}
                  </Box>
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase()) ? activeColor : textColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }
                  >
                    {route.name}
                  </Text>
                </Flex>
                <Box
                  h="36px"
                  w="4px"
                  bg={activeRoute(route.path.toLowerCase()) ? brandColor : "transparent"}
                  borderRadius="5px"
                />
              </HStack>
            </Box>
          </NavLink>
        );
      }
    });
  };

  return createLinks(routes);
}
