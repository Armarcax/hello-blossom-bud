import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
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
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import hayqLogo from "@/assets/HAYQ_LOGO.png";

const Index = () => {
  const { t, i18n } = useTranslation();
  const { setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Armenian flag inspired background */}
      <div className="absolute inset-0 bg-[var(--gradient-background)] pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-12">
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
              <button
                onClick={() => setTheme("light")}
                className="transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
                aria-label="Switch to light theme"
              >
                <img 
                  src={hayqLogo} 
                  alt="HAYQ Logo - Light Mode" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
                  style={{ mixBlendMode: 'screen' }}
                />
              </button>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--armenia-red))] via-[hsl(var(--armenia-blue))] to-[hsl(var(--armenia-orange))] drop-shadow-lg animate-fade-in">
                  Welcome to HAYQ Dashboard
                </span>
              </h1>
              <button
                onClick={() => setTheme("dark")}
                className="transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none group"
                aria-label="Switch to dark theme"
              >
                <img 
                  src={hayqLogo} 
                  alt="HAYQ Logo - Dark Mode" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
                  style={{ mixBlendMode: 'screen' }}
                />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
              {["en", "hy", "ru", "fr", "es", "de", "zh", "ja", "ar"].map((lang) => (
                <Button 
                  key={lang}
                  size="sm" 
                  variant="ghost" 
                  onClick={() => changeLanguage(lang)}
                  className="rounded-full border-2 border-primary/20 bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hover:scale-110"
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </header>

          {/* Main Dashboard Grid */}
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
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;
