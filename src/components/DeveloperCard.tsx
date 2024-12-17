import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Developer } from "../types";

interface DeveloperCardProps {
  developer: Developer;
}

export const DeveloperCard = ({ developer }: DeveloperCardProps) => {
  return (
    <Box p={5} shadow="sm" borderWidth="2px" borderRadius="lg">
      <VStack align="start" spacing={2}>
        <Heading size="md">{developer.name}</Heading>
        <Text color="gray.600">{developer.role}</Text>
        <Badge
          colorScheme={
            developer.employmentStatus === "active" ? "green" : "orange"
          }
        >
          {developer.employmentStatus}
        </Badge>
        <Text fontSize="sm">Team: {developer.team}</Text>
        <Text fontSize="sm">
          Joined: {new Date(developer.joinDate).toLocaleDateString()}
        </Text>
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={1}>
            Skills:
          </Text>
          <Wrap spacing={2}>
            {developer.skills.map((skill) => (
              <WrapItem key={skill}>
                <Badge colorScheme="blue">{skill}</Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </VStack>
    </Box>
  );
};
