import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Voting = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleVote = (option: string) => {
    toast({
      title: "Success",
      description: `Voted for: ${option}`,
    });
  };

  return (
    <Card className="component">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          {t("voting")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="font-semibold">Proposal: Increase Staking Rewards?</p>
          <div className="flex gap-2">
            <Button onClick={() => handleVote("Yes")} className="flex-1">
              Yes (65%)
            </Button>
            <Button onClick={() => handleVote("No")} variant="outline" className="flex-1">
              No (35%)
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Voting power: <span className="font-bold">500 HAYQ</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Voting;
