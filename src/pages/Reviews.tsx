import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Avatar,
  Flex,
  Badge,
  Stack,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

const Reviews = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const developerReviews = [
    {
      id: 1,
      developer: "Alex Johnson",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript"],
      rating: 5,
      projectName: "E-commerce Platform",
      completionDate: "2024-03-15",
      feedback:
        "Exceptional problem-solving abilities. Delivered complex features ahead of schedule.",
      metrics: {
        codeQuality: 5,
        communication: 5,
        deadlineMet: true,
        bugRate: "Low",
      },
      avatar: "https://bit.ly/dan-abramov",
    },
    {
      id: 2,
      developer: "Sarah Chen",
      role: "Frontend Developer",
      skills: ["React", "Vue.js", "CSS"],
      rating: 4,
      projectName: "Dashboard Redesign",
      completionDate: "2024-03-14",
      feedback:
        "Great attention to UI/UX details. Excellent component architecture.",
      metrics: {
        codeQuality: 4,
        communication: 5,
        deadlineMet: true,
        bugRate: "Medium",
      },
      avatar: "https://bit.ly/sage-adebayo",
    },
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        color={index < rating ? "yellow.400" : "gray.300"}
        w={4}
        h={4}
      />
    ));
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Developer Performance Reviews</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {developerReviews.map((review) => (
          <Card
            key={review.id}
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            shadow="sm"
          >
            <CardHeader>
              <Flex gap="4">
                <Flex flex="1" gap="4" alignItems="center">
                  <Avatar src={review.avatar} name={review.developer} />
                  <Box>
                    <Text fontWeight="bold">{review.developer}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {review.role}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody pt={0}>
              <Stack spacing={3}>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Project: {review.projectName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Completed: {review.completionDate}
                  </Text>
                </Box>
                <Flex gap={2} flexWrap="wrap">
                  {review.skills.map((skill) => (
                    <Tag key={skill} size="sm" colorScheme="blue">
                      {skill}
                    </Tag>
                  ))}
                </Flex>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Overall Rating:
                  </Text>
                  <Flex>{renderStars(review.rating)}</Flex>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold">
                    Performance Metrics:
                  </Text>
                  <Text fontSize="sm">
                    Code Quality: {review.metrics.codeQuality}/5
                  </Text>
                  <Text fontSize="sm">
                    Communication: {review.metrics.communication}/5
                  </Text>
                  <Text fontSize="sm">Bug Rate: {review.metrics.bugRate}</Text>
                </Box>
                <Text fontSize="sm">{review.feedback}</Text>
              </Stack>
            </CardBody>
            <CardFooter pt={0}>
              <Badge colorScheme={review.metrics.deadlineMet ? "green" : "red"}>
                {review.metrics.deadlineMet
                  ? "Deadline Met"
                  : "Deadline Missed"}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Reviews;
