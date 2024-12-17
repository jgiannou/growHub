import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
  Badge,
  Button,
  Progress,
  SimpleGrid,
} from "@chakra-ui/react";
import { Review } from "../types";

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit }) => {
  const metrics = [
    { label: "Code Quality", value: review.codeQuality },
    { label: "Communication", value: review.communication },
    { label: "Teamwork", value: review.teamwork },
    { label: "Delivery", value: review.delivery },
  ];

  const calculateOverallRating = (): number => {
    return Number(
      (
        metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length
      ).toFixed(1)
    );
  };

  return (
    <>
      <Flex justify="flex-end" mb={4}>
        <Button
          shadow="inner"
          background="none"
          border="2px solid"
          borderRadius={0}
          _hover={{ cursor: "pointer", bg: "#f88c59", borderColor: "black" }}
          onClick={onEdit}
        >
          Edit Evaluation
        </Button>
      </Flex>
      <Card mb={4} boxShadow="inner">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Evaluation - {new Date(review.date).toLocaleDateString()}
              </Text>
              <Badge
                colorScheme={calculateOverallRating() >= 4 ? "green" : "yellow"}
              >
                Overall: {calculateOverallRating()}
              </Badge>
            </Box>
          </Flex>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontWeight="bold" mb={3}>
                Performance Metrics
              </Text>
              {metrics.map((metric) => (
                <Box key={metric.label} mb={3}>
                  <Flex justify="space-between" mb={1}>
                    <Text>{metric.label}</Text>
                    <Text>{metric.value}/5</Text>
                  </Flex>
                  <Progress
                    value={(metric.value / 5) * 100}
                    colorScheme={metric.value >= 4 ? "green" : "yellow"}
                    borderRadius="full"
                  />
                </Box>
              ))}
            </Box>
            <Box>
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>
                  Strengths
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {review.strengths.map((strength) => (
                    <Badge key={strength} colorScheme="green">
                      {strength}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>
                  Areas for Improvement
                </Text>
                <Flex gap={2} flexWrap="wrap">
                  {review.improvements.map((area) => (
                    <Badge key={area} colorScheme="orange">
                      {area}
                    </Badge>
                  ))}
                </Flex>
              </Box>
              {review.notes && (
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Notes
                  </Text>
                  <Text>{review.notes}</Text>
                </Box>
              )}
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </>
  );
};

export default ReviewCard;
