import { Box } from "@chakra-ui/react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: { metric: string; value: number }[];
  width: number;
}

export const DepartmentMetricsChart = ({ data, width }: Props) => {
  return (
    <Box overflowX="auto">
      <RadarChart
        width={width}
        height={300}
        data={data}
        cx={width / 2}
        cy={150}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <PolarRadiusAxis domain={[0, 5]} />
        <Radar
          name="Average Score"
          dataKey="value"
          stroke="#4299E1"
          fill="#4299E1"
          fillOpacity={0.6}
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </Box>
  );
};
