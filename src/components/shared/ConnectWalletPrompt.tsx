import { Wallet } from "lucide-react";

interface ConnectWalletPromptProps {
  message?: string;
}

const ConnectWalletPrompt = ({
  message = "Connect wallet to continue",
}: ConnectWalletPromptProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
      <Wallet className="h-8 w-8 mb-2 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ConnectWalletPrompt;
