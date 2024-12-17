import { Box } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DepartmentMetrics } from "../../types";

interface Props {
  data: DepartmentMetrics[];
  width: number;
}

export const TeamPerformanceChart = ({ data, width }: Props) => {
  return (
    <Box overflowX="auto">
      <BarChart width={width} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Average Rating" fill="#4299E1" />
        <Bar dataKey="Active Members" fill="#48BB78" />
        <Bar dataKey="Total Members" fill="#ECC94B" />
      </BarChart>
    </Box>
  );
};
