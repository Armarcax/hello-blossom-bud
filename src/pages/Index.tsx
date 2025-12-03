import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout";
import WalletConnect from "@/components/WalletConnect";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import Stake from "@/components/Stake";
import Unstake from "@/components/Unstake";
import Buyback from "@/components/Buyback";
import Voting from "@/components/Voting";
import LiveChart from "@/components/LiveChart";
import DividendClaim from "@/components/DividendClaim";
import EconomicGrowth from "@/components/EconomicGrowth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WalletConnect />
        <Balance />
        <Transfer />
        <Stake />
        <Unstake />
        <Buyback />
        <Voting />
        <LiveChart />
        <DividendClaim />
        <EconomicGrowth />
      </div>
    </DashboardLayout>
  );
};

export default Index;
