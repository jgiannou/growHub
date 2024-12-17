import { Developer, Review } from "../types";

export const calculateDepartmentStats = (
  developers: Developer[],
  reviews: Review[]
) => {
  // Calculate team metrics
  const teamMetrics = developers.reduce((acc, dev) => {
    const team = dev.team;
    const devReviews = reviews.filter((r) => r.id === dev.id);
    const avgRating =
      devReviews.length > 0
        ? devReviews.reduce((sum, r) => sum + calculateRating(r), 0) /
          devReviews.length
        : 0;

    const existingTeam = acc.find((t) => t.team === team);
    if (existingTeam) {
      existingTeam.developers += 1;
      existingTeam.avgRating = (existingTeam.avgRating + avgRating) / 2;
    } else {
      acc.push({
        team,
        developers: 1,
        avgRating,
        projectsCompleted: 0, // This would come from a different source
      });
    }
    return acc;
  }, [] as { team: string; developers: number; avgRating: number; projectsCompleted: number }[]);

  // Calculate skill distribution
  const skillDistribution = developers.reduce((acc, dev) => {
    dev.skills.forEach((skill) => {
      const existingSkill = acc.find((s) => s.skill === skill);
      if (existingSkill) {
        existingSkill.count += 1;
      } else {
        acc.push({ skill, count: 1 });
      }
    });
    return acc;
  }, [] as { skill: string; count: number }[]);

  // Calculate overall metrics
  const activeDevelopers = developers.filter(
    (dev) => dev.employmentStatus === "active"
  ).length;

  const allRatings = reviews.map((r) => calculateRating(r));
  const avgRating =
    allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;

  return {
    totalDevelopers: developers.length,
    activeProjects: teamMetrics.reduce(
      (sum, team) => sum + team.projectsCompleted,
      0
    ),
    averageRating: avgRating,
    performanceChange: 0, // This would need historical data
    teamMetrics,
    skillDistribution,
    performanceMetrics: [
      { metric: "Code Quality", score: avgRating },
      { metric: "Team Collaboration", score: avgRating },
      { metric: "Project Delivery", score: avgRating },
    ],
  };
};

export const calculateRating = (review: Review): number => {
  const metrics = [
    review.codeQuality,
    review.communication,
    review.teamwork,
    review.delivery,
  ];
  return Number(
    (metrics.reduce((sum, metric) => sum + metric, 0) / metrics.length).toFixed(
      1
    )
  );
};
