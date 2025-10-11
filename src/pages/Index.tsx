import { useTranslation } from "react-i18next";
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
import { Button } from "@/components/ui/button";

const Index = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t("welcome")}
        </h1>

        <div className="lang-switcher justify-center">
          <Button size="sm" variant="outline" onClick={() => changeLanguage("en")}>EN</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("hy")}>HY</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("ru")}>RU</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("fr")}>FR</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("es")}>ES</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("de")}>DE</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("zh")}>ZH</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("ja")}>JA</Button>
          <Button size="sm" variant="outline" onClick={() => changeLanguage("ar")}>AR</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default Index;
