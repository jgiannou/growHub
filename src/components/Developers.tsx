import { useEffect } from "react";
import { Box, SimpleGrid, Spinner, Text, VStack } from "@chakra-ui/react";
import { DeveloperCard } from "./DeveloperCard";
import { useDevelopersStore } from "../store/developersStore";

export const Developers = () => {
  const { developers, loading, error, fetchDevelopers } = useDevelopersStore();

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="200px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <VStack spacing={4} p={4}>
        <Text color="red.500">Error: {error}</Text>
        <Text>
          Please make sure your Strapi server is running and your token is
          correct.
        </Text>
      </VStack>
    );
  }

  if (developers.length === 0) {
    return (
      <VStack spacing={4} p={4}>
        <Text>No developers found.</Text>
        <Text>
          Make sure you have added some developers in your Strapi admin panel.
        </Text>
      </VStack>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} p={4}>
      {developers.map((developer) => (
        <DeveloperCard key={developer.id} developer={developer} />
      ))}
    </SimpleGrid>
  );
};
