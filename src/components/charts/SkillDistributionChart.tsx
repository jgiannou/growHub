import { Box } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface Props {
  data: { name: string; value: number }[];
  width: number;
}

const COLORS = ["#48BB78", "#4299E1", "#ECC94B", "#F56565", "#9F7AEA"];

export const SkillDistributionChart = ({ data, width }: Props) => {
  return (
    <Box overflowX="auto">
      <PieChart width={width} height={300}>
        <Pie
          data={data}
          cx={width / 2}
          cy={150}
          labelLine={false}
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Box>
  );
};
