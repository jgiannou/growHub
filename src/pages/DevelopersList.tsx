import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  Box,
  Flex,
  Spacer,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Spinner,
  Center,
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Developer, Review } from "../types";
import DeveloperForm from "../components/DeveloperForm";
import { useDevelopersStore } from "../store/developersStore";
import { useReviewsStore } from "../store/reviewsStore";

const DevelopersList = () => {
  const {
    developers,
    loading: developersLoading,
    fetchDevelopers,
    addDeveloper,
    updateDeveloper,
  } = useDevelopersStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewsStore();
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (developers.length === 0) {
      fetchDevelopers();
    }
  }, [developers.length, fetchDevelopers]);

  useEffect(() => {
    if (developers.length > 0) {
      fetchReviews(developers.map((dev) => dev.id));
    }
  }, [developers, fetchReviews]);

  const getLatestReview = (developerId: number) => {
    const devReviews = reviews.filter((r) => r.developer?.id === developerId);
    return devReviews[devReviews.length - 1];
  };

  const calculateRating = (review: Review) => {
    const metrics = [
      review.codeQuality,
      review.communication,
      review.teamwork,
      review.delivery,
    ];
    return Number(
      (
        metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length
      ).toFixed(1)
    );
  };

  const handleOpenForm = (developer?: Developer) => {
    if (developer) {
      setSelectedDeveloper(developer);
    } else {
      setSelectedDeveloper(null);
    }
    onOpen();
  };

  const handleCloseForm = () => {
    setSelectedDeveloper(null);
    onClose();
  };

  const handleSubmit = async (
    developerData: Partial<Developer>
  ): Promise<Developer | undefined> => {
    let result;
    if (selectedDeveloper) {
      result = await updateDeveloper({
        ...selectedDeveloper,
        ...developerData,
      });
      if (result) {
        fetchReviews(developers.map((dev) => dev.id));
        fetchDevelopers();
      }
    } else {
      result = await addDeveloper(developerData);
    }
    return result;
  };

  const handleRowClick = (dev: Developer) => {
    if (event?.target instanceof HTMLElement && event.target.tagName === "TD") {
      navigate(`/developers/${dev.id}/profile`);
    }
  };

  const sortedDevelopers = [...developers].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (sortOrder === "asc") {
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    } else {
      return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
    }
  });

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (developersLoading || reviewsLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Flex mb={8}>
        <Heading size="lg">Developers</Heading>
        <Spacer />
        <Button
          onClick={() => handleOpenForm()}
          shadow="inner"
          background="none"
          border="2px solid"
          borderRadius={0}
          leftIcon={<FiPlus />}
          _hover={{ cursor: "pointer", bg: "#f88c59", borderColor: "black" }}
        >
          Add Developer
        </Button>
      </Flex>

      <DeveloperForm
        isOpen={isOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        developer={selectedDeveloper || undefined}
      />

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th onClick={handleSort} style={{ cursor: "pointer" }}>
                Name {sortOrder === "asc" ? "↑" : "↓"}
              </Th>
              <Th>Role</Th>
              <Th>Team</Th>
              <Th>Status</Th>
              <Th>Skills</Th>
              <Th>Join Date</Th>
              <Th>Latest Review</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedDevelopers.map((dev) => {
              const latestReview = getLatestReview(dev.id);
              const rating = latestReview
                ? calculateRating(latestReview)
                : null;

              return (
                <Tr
                  key={dev.id}
                  onClick={() => handleRowClick(dev)}
                  _hover={{ cursor: "pointer", bg: "#f88c59" }}
                >
                  <Td>
                    <Link
                      color="blue.500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {dev.name}
                    </Link>
                  </Td>
                  <Td>{dev.role}</Td>
                  <Td>{dev.team}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        dev.employmentStatus === "active"
                          ? "green"
                          : dev.employmentStatus === "vacation"
                          ? "orange"
                          : "red"
                      }
                    >
                      {dev.employmentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <Wrap spacing={1}>
                      {dev.skills.slice(0, 3).map((skill) => (
                        <WrapItem key={skill}>
                          <Badge size="sm" colorScheme="blue">
                            {skill}
                          </Badge>
                        </WrapItem>
                      ))}
                      {dev.skills.length > 3 && (
                        <WrapItem>
                          <Badge size="sm" colorScheme="gray">
                            +{dev.skills.length - 3}
                          </Badge>
                        </WrapItem>
                      )}
                    </Wrap>
                  </Td>
                  <Td>{new Date(dev.joinDate).toLocaleDateString()}</Td>
                  <Td>
                    {rating ? (
                      <Badge colorScheme={rating >= 4 ? "green" : "yellow"}>
                        {rating.toFixed(1)}
                      </Badge>
                    ) : (
                      "No review"
                    )}
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenForm(dev);
                      }}
                    >
                      Edit
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default DevelopersList;
