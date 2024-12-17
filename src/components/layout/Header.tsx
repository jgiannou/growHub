import { Flex, Spacer, Button, Image } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex
      px={6}
      py={4}
      borderBottom="4px"
      borderColor="gray.300"
      borderStyle="dashed"
      align="center"
    >
      <Image src="/growHubLogo.svg" alt="Grow Hub" width={200} />
      <Spacer />
      <Button size="sm">Profile</Button>
    </Flex>
  );
};

export default Header;
