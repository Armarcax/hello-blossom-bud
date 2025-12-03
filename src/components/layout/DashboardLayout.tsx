import { ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import Footer from "@/components/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Armenian flag inspired background */}
      <div className="absolute inset-0 bg-[var(--gradient-background)] pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader />
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
