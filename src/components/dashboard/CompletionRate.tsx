import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CompletionRateProps {
  title: string;
  value: string;
  subtext: string;
  percentage: number;
  trend: "up" | "down";
  link: string;
}

export function CompletionRate({
  title,
  value,
  subtext,
  percentage,
  trend,
  link,
}: CompletionRateProps) {
  return (
    <Link to={link}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          <div className={`text-xs mt-2 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? "↑" : "↓"} {percentage}%
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
