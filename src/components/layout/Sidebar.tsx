import { Box, VStack, Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiHome, FiUsers } from "react-icons/fi";

interface NavItemProps {
  icon: IconType;
  to: string;
  children: React.ReactNode;
}

const NavItem = ({ icon: IconComponent, to, children }: NavItemProps) => (
  <Link
    as={RouterLink}
    to={to}
    _hover={{ textDecoration: "none", bg: "gray.100" }}
    p={2}
    borderRadius="md"
    display="flex"
    alignItems="center"
  >
    <IconComponent size={18} style={{ marginRight: "12px" }} />
    <Text>{children}</Text>
  </Link>
);

const Sidebar = () => {
  return (
    <Box
      w="240px"
      borderRight="4px"
      borderColor="gray.300"
      borderStyle="dashed"
      p={4}
    >
      <VStack align="stretch" spacing={4}>
        <NavItem icon={FiHome} to="/">
          Dashboard
        </NavItem>
        <NavItem icon={FiUsers} to="/developers">
          Developers
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;
