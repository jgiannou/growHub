import {
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

interface StatCardProps {
  label: string;
  value: string | number;
  helpText?: string;
  trend?: "increase" | "decrease";
}

export const StatCard = ({ label, value, helpText, trend }: StatCardProps) => {
  return (
    <Card shadow="none">
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber>
            {trend && <StatArrow type={trend} />}
            {value}
          </StatNumber>
          <StatHelpText>{helpText}</StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );
};
