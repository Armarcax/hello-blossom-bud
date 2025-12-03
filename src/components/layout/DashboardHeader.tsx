import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import hayqLogo from "@/assets/HAYQ_LOGO.png";
import LanguageSwitcher from "./LanguageSwitcher";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="mb-12">
      <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
        <ThemeButton
          theme="light"
          onClick={() => setTheme("light")}
          glowColor="rgba(59,130,246,0.5)"
        />

        <div className="flex items-center gap-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center flex-1">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--armenia-red))] via-[hsl(var(--armenia-blue))] to-[hsl(var(--armenia-orange))] drop-shadow-lg animate-fade-in">
              Welcome to HAYQ Dashboard
            </span>
          </h1>

          <UserActions
            isAdmin={isAdmin}
            onAdminClick={() => navigate("/admin")}
            onSignOut={handleSignOut}
          />
        </div>

        <ThemeButton
          theme="dark"
          onClick={() => setTheme("dark")}
          glowColor="rgba(168,85,247,0.5)"
        />
      </div>

      <LanguageSwitcher />
    </header>
  );
};

interface ThemeButtonProps {
  theme: "light" | "dark";
  onClick: () => void;
  glowColor: string;
}

const ThemeButton = ({ theme, onClick, glowColor }: ThemeButtonProps) => (
  <button
    onClick={onClick}
    className="transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
    aria-label={`Switch to ${theme} theme`}
  >
    <img
      src={hayqLogo}
      alt={`HAYQ Logo - ${theme} Mode`}
      className="w-16 h-16 md:w-20 md:h-20 object-contain transition-all group-hover:drop-shadow-[0_0_15px_var(--glow-color)]"
      style={
        {
          mixBlendMode: "screen",
          "--glow-color": glowColor,
        } as React.CSSProperties
      }
    />
  </button>
);

interface UserActionsProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onSignOut: () => void;
}

const UserActions = ({ isAdmin, onAdminClick, onSignOut }: UserActionsProps) => (
  <div className="flex gap-2">
    {isAdmin && (
      <Button size="sm" onClick={onAdminClick} className="rounded-full">
        <Shield className="h-4 w-4 mr-2" />
        Admin
      </Button>
    )}
    <Button size="sm" variant="outline" onClick={onSignOut} className="rounded-full">
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  </div>
);

export default DashboardHeader;
