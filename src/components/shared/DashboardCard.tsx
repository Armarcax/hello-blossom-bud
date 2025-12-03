import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  headerAction?: ReactNode;
  className?: string;
}

const DashboardCard = ({
  title,
  icon: Icon,
  children,
  headerAction,
  className = "",
}: DashboardCardProps) => {
  return (
    <Card className={`component ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </div>
          {headerAction}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default DashboardCard;
