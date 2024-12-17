import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Flex,
  Icon,
  Center,
  IconButton,
  useDisclosure,
  Button,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { StarIcon } from "@chakra-ui/icons";
import { Developer, Review } from "../types";
import { api } from "../services/api";
import { FiArrowLeft } from "react-icons/fi";
import { useDevelopersStore } from "../store/developersStore";
import DeveloperForm from "../components/DeveloperForm";
import { useReviewsStore } from "../store/reviewsStore";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
  PolarRadiusAxis,
} from "recharts";

const DeveloperProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    isOpen: isDevFormOpen,
    onOpen: onDevFormOpen,
    onClose: onDevFormClose,
  } = useDisclosure();
  const {
    isOpen: isReviewFormOpen,
    onOpen: onReviewFormOpen,
    onClose: onReviewFormClose,
  } = useDisclosure();
  const { fetchDevelopers, updateDeveloper } = useDevelopersStore();
  const { reviews, fetchReviews, addReview, updateReview } = useReviewsStore();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const dev = await api.developers.getById(Number(id));
        setDeveloper(dev);
        fetchReviews(Number(id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, fetchReviews]);

  const handleDevSubmit = async (
    developerData: Partial<Developer>
  ): Promise<Developer | undefined> => {
    if (!developer) return;
    const result = await updateDeveloper({
      ...developer,
      ...developerData,
    });
    if (result) {
      setDeveloper(result);
    }
    return result;
  };

  const handleReviewSubmit = async (
    reviewData: Partial<Review>
  ): Promise<Review | undefined> => {
    if (!developer) return;
    try {
      let result;
      if (selectedReview) {
        result = await updateReview({
          ...selectedReview,
          ...reviewData,
        });
      } else {
        result = await addReview({
          ...reviewData,
          developer: developer,
        });
      }
      if (result) {
        await fetchReviews(developer.id);
        onReviewFormClose();
      }
      return result;
    } catch (error) {
      console.error("Error submitting review:", error);
      return undefined;
    }
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    fetchDevelopers();

    onReviewFormOpen();
  };

  const handleAddReview = () => {
    setSelectedReview(null);
    onReviewFormOpen();
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Icon
        key={index}
        as={StarIcon}
        color={index < rating ? "yellow.400" : "gray.300"}
        w={4}
        h={4}
      />
    ));
  };

  const calculateOverallRating = (review: Review): number => {
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

  const getLatestReview = (reviews: Review[]): Review | null => {
    return reviews.length > 0 ? reviews[0] : null;
  };

  if (!developer) {
    return (
      <Center h="200px">
        <Text>No data available</Text>
      </Center>
    );
  }

  const metrics = [
    {
      label: "Code Quality",
      value:
        getLatestReview(reviews)?.codeQuality ||
        selectedReview?.codeQuality ||
        0,
    },
    {
      label: "Communication",
      value:
        selectedReview?.communication ||
        getLatestReview(reviews)?.communication ||
        0,
    },
    {
      label: "Teamwork",
      value:
        selectedReview?.teamwork || getLatestReview(reviews)?.teamwork || 0,
    },
    {
      label: "Delivery",
      value:
        selectedReview?.delivery || getLatestReview(reviews)?.delivery || 0,
    },
  ];
  return (
    <Container maxW="container.xl" py={5}>
      <Flex mb={8} align="center">
        <IconButton
          aria-label="Back to developers"
          icon={<FiArrowLeft />}
          variant="ghost"
          mr={4}
          onClick={() => navigate("/developers")}
          _hover={{ bg: "#f88c59" }}
        />
        <Heading size="md">{developer.name}</Heading>
      </Flex>

      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Evaluations</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex justify="flex-end" mb={4}>
              <Button
                onClick={onDevFormOpen}
                shadow="inner"
                background="none"
                border="2px solid"
                borderRadius={0}
                _hover={{
                  cursor: "pointer",
                  bg: "#f88c59",
                  borderColor: "black",
                }}
              >
                Edit Developer
              </Button>
            </Flex>

            <DeveloperForm
              isOpen={isDevFormOpen}
              onClose={onDevFormClose}
              onSubmit={handleDevSubmit}
              developer={developer || undefined}
            />

            <Card boxShadow="inner">
              <CardHeader>
                <Flex gap={4} alignItems="center">
                  <Box>
                    <Text color="gray.600">{developer.role}</Text>
                  </Box>
                  <Badge
                    colorScheme={
                      developer.employmentStatus === "active"
                        ? "green"
                        : "orange"
                    }
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {developer.employmentStatus.toUpperCase()}
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <Box>
                    <Heading size="md" mb={4}>
                      Performance Metrics
                    </Heading>
                    <Stat mb={6}>
                      <StatLabel>Overall Rating</StatLabel>
                      <StatNumber>
                        <Flex align="center" gap={2}>
                          {selectedReview || getLatestReview(reviews) ? (
                            <>
                              {calculateOverallRating(
                                selectedReview || getLatestReview(reviews)!
                              )}
                              <Box>
                                {renderStars(
                                  calculateOverallRating(
                                    selectedReview || getLatestReview(reviews)!
                                  )
                                )}
                              </Box>
                            </>
                          ) : (
                            "No reviews yet"
                          )}
                        </Flex>
                      </StatNumber>
                      <StatHelpText>
                        {getLatestReview(reviews)
                          ? `Last updated: ${new Date(
                              selectedReview?.date ||
                                getLatestReview(reviews)!.date
                            ).toLocaleDateString()}`
                          : "No reviews available"}
                      </StatHelpText>
                    </Stat>

                    <Box>
                      {metrics.map((metric) => (
                        <Box key={metric.label} mb={4}>
                          <Flex justify="space-between" mb={2}>
                            <Text fontWeight="medium">{metric.label}</Text>
                            <Flex align="center" gap={2}>
                              {metric.value.toFixed(1)}
                              <Box>{renderStars(metric.value)}</Box>
                            </Flex>
                          </Flex>
                          <Progress
                            value={(metric.value / 5) * 100}
                            colorScheme={
                              metric.value >= 4.5
                                ? "green"
                                : metric.value >= 4
                                ? "blue"
                                : "yellow"
                            }
                            borderRadius="full"
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Heading size="md" mb={4}>
                      Skills & Feedback
                    </Heading>

                    <Box mb={6}>
                      <Text fontWeight="bold" mb={2}>
                        Technical Skills
                      </Text>
                      <Flex gap={2} flexWrap="wrap">
                        {developer.skills.map((skill: string) => (
                          <Badge key={skill} colorScheme="blue">
                            {skill}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>

                    <Box mb={6}>
                      <Text fontWeight="bold" mb={2}>
                        Key Strengths
                      </Text>
                      <Flex gap={2} flexWrap="wrap">
                        {(
                          selectedReview || getLatestReview(reviews)
                        )?.strengths.map((strength) => (
                          <Badge key={strength} colorScheme="green">
                            {strength}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>

                    <Box mb={6}>
                      <Text fontWeight="bold" mb={2}>
                        Areas for Improvement
                      </Text>
                      <Flex gap={2} flexWrap="wrap">
                        {(
                          selectedReview || getLatestReview(reviews)
                        )?.improvements.map((area) => (
                          <Badge key={area} colorScheme="orange">
                            {area}
                          </Badge>
                        ))}
                      </Flex>
                    </Box>

                    {(selectedReview || getLatestReview(reviews))?.notes && (
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Notes
                        </Text>
                        <Text>
                          {(selectedReview || getLatestReview(reviews))?.notes}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </SimpleGrid>
              </CardBody>
            </Card>

            <Box mt={8}>
              <Heading size="md" mb={4}>
                Visual Metrics
              </Heading>
              <Box
                boxShadow="inner"
                height="300px"
                p={4}
                borderRadius="md"
                border="2px dashed"
                borderColor="gray.300"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={[
                      {
                        subject: "Code Quality",
                        value: metrics[0].value,
                        fullMark: 5,
                      },
                      {
                        subject: "Communication",
                        value: metrics[1].value,
                        fullMark: 5,
                      },
                      {
                        subject: "Teamwork",
                        value: metrics[2].value,
                        fullMark: 5,
                      },
                      {
                        subject: "Delivery",
                        value: metrics[3].value,
                        fullMark: 5,
                      },
                    ]}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 5]} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#f88c59"
                      fill="#f88c59"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel>
            {reviews.length === 0 ? (
              <Flex justify="flex-end" mb={4}>
                <Button
                  onClick={handleAddReview}
                  shadow="inner"
                  background="none"
                  border="2px solid"
                  borderRadius={0}
                  _hover={{
                    cursor: "pointer",
                    bg: "#f88c59",
                    borderColor: "black",
                  }}
                >
                  Add Evaluation
                </Button>
              </Flex>
            ) : (
              <ReviewCard
                key={reviews[0].id}
                review={reviews[0]}
                onEdit={() => handleEditReview(reviews[0])}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <DeveloperForm
        isOpen={isDevFormOpen}
        onClose={onDevFormClose}
        onSubmit={handleDevSubmit}
        developer={developer || undefined}
      />

      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={onReviewFormClose}
        onSubmit={handleReviewSubmit}
        review={selectedReview || undefined}
        developerId={developer?.id || 0}
        developer={developer}
      />
    </Container>
  );
};

export default DeveloperProfile;
