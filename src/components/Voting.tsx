import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3Context } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useBalance } from "@/hooks/useBalance";
import { handleContractError } from "@/utils/contractHelpers";
import { ethers } from "ethers";

interface ProposalData {
  id: number;
  description: string;
  yesVotes: string;
  noVotes: string;
  deadline: number;
  executed: boolean;
}

const Voting = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { account, isConnected } = useWeb3Context();
  const { readContract, contract } = useContract();
  const { stakedBalance } = useBalance();
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<ProposalData | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!readContract) return;

      try {
        // Fetch active proposal (ID 0 for demo)
        const proposalData = await readContract.getProposal(0);
        
        setProposal({
          id: 0,
          description: proposalData.description || "Increase Staking Rewards?",
          yesVotes: ethers.utils.formatEther(proposalData.yesVotes || 0),
          noVotes: ethers.utils.formatEther(proposalData.noVotes || 0),
          deadline: proposalData.deadline?.toNumber() || 0,
          executed: proposalData.executed || false,
        });
      } catch (error) {
        console.error('Error fetching proposal:', error);
      }
    };

    fetchProposal();
    const interval = setInterval(fetchProposal, 30000);
    return () => clearInterval(interval);
  }, [readContract]);

  const handleVote = async (support: boolean) => {
    if (!contract || !isConnected || !proposal) {
      toast({
        title: "Error",
        description: "Please connect wallet",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.vote(proposal.id, support);
      
      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();
      
      toast({
        title: "Success",
        description: `Voted ${support ? "Yes" : "No"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: handleContractError(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getVotePercentages = () => {
    if (!proposal) return { yes: 0, no: 0 };
    
    const yes = parseFloat(proposal.yesVotes);
    const no = parseFloat(proposal.noVotes);
    const total = yes + no;
    
    if (total === 0) return { yes: 50, no: 50 };
    
    return {
      yes: Math.round((yes / total) * 100),
      no: Math.round((no / total) * 100),
    };
  };

  const percentages = getVotePercentages();

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
          <p className="font-semibold">
            Proposal: {proposal?.description || "Increase Staking Rewards?"}
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleVote(true)} 
              className="flex-1"
              disabled={!isConnected || loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Yes ({percentages.yes}%)
            </Button>
            <Button 
              onClick={() => handleVote(false)} 
              variant="outline" 
              className="flex-1"
              disabled={!isConnected || loading}
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              No ({percentages.no}%)
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Voting power: <span className="font-bold">{parseFloat(stakedBalance).toFixed(2)} HAYQ</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Voting;
