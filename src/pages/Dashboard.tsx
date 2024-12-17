import React, { useEffect } from "react";
import {
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";
import { useDevelopersStore } from "../store/developersStore";
import { useReviewsStore } from "../store/reviewsStore";
import { TeamPerformanceChart } from "../components/charts/TeamPerformanceChart";
import { SkillDistributionChart } from "../components/charts/SkillDistributionChart";
import { DepartmentMetricsChart } from "../components/charts/DepartmentMetricsChart";
import { StatCard } from "../components/StatCard";
import { Review } from "../types";

interface DepartmentMetricsData {
  metric: string;
  value: number;
}

const Dashboard = () => {
  const {
    developers,
    loading: devsLoading,
    error: devsError,
    fetchDevelopers,
  } = useDevelopersStore();
  const { reviews, loading: reviewsLoading, fetchReviews } = useReviewsStore();
  const [chartWidth, setChartWidth] = React.useState(400);

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  useEffect(() => {
    if (developers.length > 0) {
      // Fetch reviews for all developers
      developers.forEach((dev) => fetchReviews(dev.id));
    }
  }, [developers, fetchReviews]);

  // Calculate department metrics
  const departmentMetrics = developers.reduce((acc, dev) => {
    const department = dev.team;
    if (!acc[department]) {
      acc[department] = {
        name: department,
        total: 0,
        avgRating: 0,
        activeMembers: 0,
      };
    }

    acc[department].total += 1;
    if (dev.employmentStatus === "active") {
      acc[department].activeMembers += 1;
    }

    // Find developer's reviews
    const devReviews = reviews.filter((r) => r.developer?.id === dev.id);
    if (devReviews.length > 0) {
      const avgRating =
        devReviews.reduce((sum, r) => {
          return (
            sum +
            (r.codeQuality + r.communication + r.teamwork + r.delivery) / 4
          );
        }, 0) / devReviews.length;
      acc[department].avgRating += avgRating;
    }

    return acc;
  }, {} as Record<string, { name: string; total: number; avgRating: number; activeMembers: number }>);

  // Team Performance Chart Data
  const teamPerformanceData = Object.values(departmentMetrics).map((dept) => ({
    name: dept.name,
    "Average Rating": Number((dept.avgRating / dept.total).toFixed(1)),
    "Active Members": dept.activeMembers,
    "Total Members": dept.total,
  }));

  // Skills Distribution Chart Data
  const skillsData = developers.reduce((acc, dev) => {
    dev.skills.forEach((skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const skillDistributionData = Object.entries(skillsData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Department Metrics Chart Data
  const calculateMetricAverage = (
    metric: keyof Pick<
      Review,
      "codeQuality" | "communication" | "teamwork" | "delivery"
    >
  ) => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, r) => sum + (r[metric] as number), 0) /
      reviews.length
    );
  };

  const departmentMetricsData: DepartmentMetricsData[] = [
    { metric: "Code Quality", value: calculateMetricAverage("codeQuality") },
    { metric: "Communication", value: calculateMetricAverage("communication") },
    { metric: "Teamwork", value: calculateMetricAverage("teamwork") },
    { metric: "Delivery", value: calculateMetricAverage("delivery") },
  ];

  // Error boundary component
  const ChartErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    if (devsError) {
      return (
        <Alert status="error">
          <AlertIcon />
          Error loading chart data
        </Alert>
      );
    }
    if (devsLoading || reviewsLoading) {
      return (
        <Center p={4}>
          <Spinner />
        </Center>
      );
    }
    return <>{children}</>;
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setChartWidth(width < 1200 ? width - 64 : 400);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard label="Total Developers" value={developers.length} />
        <StatCard
          label="Active Developers"
          value={
            developers.filter((d) => d.employmentStatus === "active").length
          }
        />
        <StatCard
          label="Average Rating"
          value={calculateMetricAverage("codeQuality").toFixed(1)}
        />
        <StatCard label="Reviews" value={reviews.length} />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        <Card>
          <CardHeader>
            <Heading size="md">Team Performance</Heading>
          </CardHeader>
          <CardBody>
            <ChartErrorBoundary>
              {teamPerformanceData.length > 0 ? (
                <TeamPerformanceChart
                  data={teamPerformanceData}
                  width={chartWidth}
                />
              ) : (
                <Text>No team performance data available</Text>
              )}
            </ChartErrorBoundary>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Skills Distribution</Heading>
          </CardHeader>
          <CardBody>
            <ChartErrorBoundary>
              {skillDistributionData.length > 0 ? (
                <SkillDistributionChart
                  data={skillDistributionData}
                  width={chartWidth}
                />
              ) : (
                <Text>No skills distribution data available</Text>
              )}
            </ChartErrorBoundary>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardHeader>
          <Heading size="md">Department Metrics</Heading>
        </CardHeader>
        <CardBody>
          <ChartErrorBoundary>
            {departmentMetricsData.length > 0 ? (
              <DepartmentMetricsChart
                data={departmentMetricsData}
                width={chartWidth * 2}
              />
            ) : (
              <Text>No department metrics data available</Text>
            )}
          </ChartErrorBoundary>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Dashboard;
