import { Coins, Lock, TrendingUp, ExternalLink, Shield, FileText, CheckCircle2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTokenomics, formatSupply, formatSupplyAbbreviated } from '@/hooks/useTokenomics';
import { WEB3_CONFIG } from '@/config/web3';
import WhitepaperDownload from '@/components/WhitepaperDownload';

/**
 * Supply Stat Card Component
 */
const SupplyStat = ({
  icon: Icon,
  label,
  value,
  abbreviatedValue,
  percentage,
  variant = 'default',
  verified = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  abbreviatedValue: string;
  percentage?: number;
  variant?: 'default' | 'circulating' | 'locked';
  verified?: boolean;
}) => {
  const variantClasses = {
    default: 'text-foreground',
    circulating: 'text-accent',
    locked: 'text-muted-foreground',
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
      <div className={`p-2 rounded-lg ${variant === 'circulating' ? 'bg-accent/10' : variant === 'locked' ? 'bg-muted' : 'bg-primary/10'}`}>
        <Icon className={`h-5 w-5 ${variant === 'circulating' ? 'text-accent' : variant === 'locked' ? 'text-muted-foreground' : 'text-primary'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          {verified && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 gap-1 text-primary border-primary/30">
              <CheckCircle2 className="h-2.5 w-2.5" />
              On-Chain
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className={`text-2xl font-bold ${variantClasses[variant]}`}>
            {abbreviatedValue}
          </span>
          <span className="text-sm text-muted-foreground font-medium">HAYQ</span>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {value} tokens
        </div>
        {percentage !== undefined && (
          <div className="mt-2">
            <Progress 
              value={percentage} 
              className={`h-1.5 ${variant === 'circulating' ? '[&>div]:bg-accent' : variant === 'locked' ? '[&>div]:bg-muted-foreground' : ''}`}
            />
            <span className="text-xs text-muted-foreground mt-1 block">
              {percentage.toFixed(2)}% of total supply
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Contract Links Component
 */
const ContractLinks = ({ 
  tokenAddress, 
  vestingVaultAddress 
}: { 
  tokenAddress: string; 
  vestingVaultAddress: string | null;
}) => {
  const baseUrl = WEB3_CONFIG.blockExplorer;
  
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={`${baseUrl}/address/${tokenAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary hover:bg-primary/10 transition-colors"
      >
        <FileText className="h-4 w-4" />
        Token Contract
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
      {vestingVaultAddress && (
        <a
          href={`${baseUrl}/address/${vestingVaultAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground hover:bg-muted/80 transition-colors"
        >
          <Lock className="h-4 w-4" />
          Vesting Contract
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
};

/**
 * Token Metadata Component
 */
const TokenMetadata = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { label: 'Token Name', value: 'HAYQ' },
      { label: 'Network', value: 'Ethereum' },
      { label: 'Standard', value: 'ERC-20' },
      { label: 'Decimals', value: '18' },
    ].map(({ label, value }) => (
      <div key={label} className="text-center p-3 rounded-lg bg-muted/30">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="font-semibold text-foreground">{value}</div>
      </div>
    ))}
  </div>
);

/**
 * Whitepaper Section Component
 */
const WhitepaperSection = ({ vestingVaultAddress }: { vestingVaultAddress: string | null }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-2">
      <FileText className="h-5 w-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">Tokenomics Overview</h3>
      <Badge variant="secondary" className="text-xs">Whitepaper Extract</Badge>
    </div>

    <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
      <p>
        HAYQ operates with a fixed economic supply of <strong className="text-foreground">1,000,000,000 tokens</strong>. 
        While the smart contract architecture allows for a higher theoretical maximum, only 1B HAYQ are economically issued. 
        Distribution and circulation are enforced on-chain via a public, verified vesting contract.
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-6">
        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Circulating Supply
          </h4>
          <p className="text-sm">
            Circulating supply represents tokens that are actively tradeable and transferable. 
            This excludes all tokens held in the vesting contract, treasury reserves, or any other locked mechanisms.
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Locked / Treasury
          </h4>
          <p className="text-sm">
            The majority of supply is secured in a time-locked vesting contract. 
            These tokens are non-circulating and cannot be transferred until their scheduled unlock date.
          </p>
        </div>
      </div>
    </div>

    {/* Vesting Mechanics */}
    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-2">Vesting & Lockup Mechanics</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span>Token release is strictly time-based — no manual or early unlocks are possible</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span>Vesting contract is public and verified on Etherscan</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span>No hidden or discretionary minting mechanisms exist</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <span>All supply figures are calculated directly from on-chain data</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Supply Transparency Note */}
    <div className="p-4 rounded-lg bg-muted/50 border border-border">
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">Transparency Note:</strong> The majority of the HAYQ supply is locked in a publicly verifiable, 
        on-chain vesting contract. These tokens are time-locked and cannot enter circulation prematurely. 
        All supply metrics displayed are fetched directly from the blockchain — no hardcoded values are used.
      </p>
    </div>
  </div>
);

/**
 * Tokenomics Component
 * Displays token supply breakdown with on-chain data
 * Designed for exchange listing standards (CoinGecko, CMC, DEX)
 */
const Tokenomics = () => {
  const { data: tokenomics, isLoading, isError } = useTokenomics();

  if (isLoading) {
    return (
      <Card className="component glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            HAYQ Tokenomics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !tokenomics) {
    return (
      <Card className="component glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            HAYQ Tokenomics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Unable to load tokenomics data. Please check your network connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="component glass-effect lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              HAYQ Tokenomics
            </CardTitle>
            <CardDescription className="mt-1">
              On-chain verified supply metrics • Single source of truth
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Live Data
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {WEB3_CONFIG.networkName}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Token Metadata */}
        <TokenMetadata />

        <Separator />

        {/* Supply Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <SupplyStat
            icon={Coins}
            label="Total Supply (Economic)"
            value={formatSupply(tokenomics.totalSupply)}
            abbreviatedValue={formatSupplyAbbreviated(tokenomics.totalSupply)}
            verified
          />
          <SupplyStat
            icon={TrendingUp}
            label="Circulating Supply"
            value={formatSupply(tokenomics.circulatingSupply)}
            abbreviatedValue={formatSupplyAbbreviated(tokenomics.circulatingSupply)}
            percentage={tokenomics.circulatingPercent}
            variant="circulating"
            verified
          />
          <SupplyStat
            icon={Lock}
            label="Locked / Treasury"
            value={formatSupply(tokenomics.lockedSupply)}
            abbreviatedValue={formatSupplyAbbreviated(tokenomics.lockedSupply)}
            percentage={tokenomics.lockedPercent}
            variant="locked"
            verified
          />
        </div>

        {/* Contract Links */}
        {WEB3_CONFIG.contractAddress && (
          <ContractLinks 
            tokenAddress={WEB3_CONFIG.contractAddress}
            vestingVaultAddress={tokenomics.vestingVaultAddress}
          />
        )}

        <Separator />

        {/* Whitepaper Section */}
        <WhitepaperSection vestingVaultAddress={tokenomics.vestingVaultAddress} />

        <Separator />

        {/* Whitepaper Download */}
        <WhitepaperDownload />
      </CardContent>
    </Card>
  );
};

export default Tokenomics;
