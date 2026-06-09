import { ReactNode } from "react";
import { LucideIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  loadingText?: string;
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

const ActionButton = ({
  onClick,
  loading = false,
  disabled = false,
  icon: Icon,
  loadingText = "Processing...",
  children,
  variant = "default",
  className = "w-full",
}: ActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      variant={variant}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4 mr-2" />}
          {children}
        </>
      )}
    </Button>
  );
};

export default ActionButton;
