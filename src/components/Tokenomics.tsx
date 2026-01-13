import { useTranslation } from 'react-i18next';
import { Coins, Lock, TrendingUp, ExternalLink, Info, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTokenomics, formatSupply, formatSupplyAbbreviated } from '@/hooks/useTokenomics';
import { WEB3_CONFIG } from '@/config/web3';

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
  tooltip,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  abbreviatedValue: string;
  percentage?: number;
  variant?: 'default' | 'circulating' | 'locked';
  tooltip?: string;
}) => {
  const variantClasses = {
    default: 'text-foreground',
    circulating: 'text-accent',
    locked: 'text-muted-foreground',
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
      <div className={`p-2 rounded-lg ${variant === 'circulating' ? 'bg-accent/10' : variant === 'locked' ? 'bg-muted' : 'bg-primary/10'}`}>
        <Icon className={`h-5 w-5 ${variant === 'circulating' ? 'text-accent' : variant === 'locked' ? 'text-muted-foreground' : 'text-primary'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground/50" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-xl font-bold ${variantClasses[variant]}`}>
            {abbreviatedValue}
          </span>
          <span className="text-xs text-muted-foreground">HAYQ</span>
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
 * Vesting Explanation Component
 */
const VestingExplanation = ({ vestingVaultAddress }: { vestingVaultAddress: string | null }) => {
  const explorerUrl = vestingVaultAddress 
    ? `${WEB3_CONFIG.blockExplorer}/address/${vestingVaultAddress}`
    : null;

  return (
    <div className="mt-6 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-2">Time-Locked Vesting Contract</h4>
          <p className="text-sm text-muted-foreground mb-3">
            The majority of HAYQ supply is secured in a time-locked vesting contract. 
            This ensures long-term stability and protects against market volatility.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5 mb-3">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Token release is strictly time-based — no manual or early unlocks
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Contract is public and verified on-chain
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              Locked tokens are non-circulating and non-transferable
            </li>
          </ul>
          {explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View Vesting Contract
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Tokenomics Component
 * Displays token supply breakdown with on-chain data
 */
const Tokenomics = () => {
  const { t } = useTranslation();
  const { data: tokenomics, isLoading, isError } = useTokenomics();

  if (isLoading) {
    return (
      <Card className="component glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Tokenomics
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
            Tokenomics
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              HAYQ Tokenomics
            </CardTitle>
            <CardDescription className="mt-1">
              On-chain supply metrics • Single source of truth
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            Live Data
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Total Supply */}
          <SupplyStat
            icon={Coins}
            label="Total Supply"
            value={formatSupply(tokenomics.totalSupply)}
            abbreviatedValue={formatSupplyAbbreviated(tokenomics.totalSupply)}
            tooltip="The maximum number of HAYQ tokens that will ever exist"
          />

          {/* Circulating Supply */}
          <SupplyStat
            icon={TrendingUp}
            label="Circulating Supply"
            value={formatSupply(tokenomics.circulatingSupply)}
            abbreviatedValue={formatSupplyAbbreviated(tokenomics.circulatingSupply)}
            percentage={tokenomics.circulatingPercent}
            variant="circulating"
            tooltip="Tokens available for trading, excluding locked/vested tokens"
          />

          {/* Locked / Treasury */}
          <SupplyStat
            icon={Lock}
            label="Locked / Treasury"
            value={formatSupply(tokenomics.lockedSupply)}
            abbreviatedValue={formatSupplyAbbreviated(tokenomics.lockedSupply)}
            percentage={tokenomics.lockedPercent}
            variant="locked"
            tooltip="Tokens held in the time-locked vesting contract"
          />
        </div>

        {/* Vesting Contract Explanation */}
        <VestingExplanation vestingVaultAddress={tokenomics.vestingVaultAddress} />

        {/* Key Points */}
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <h5 className="text-sm font-medium text-foreground mb-1">Why Vesting?</h5>
            <p className="text-xs text-muted-foreground">
              Time-locked vesting protects token holders from sudden supply shocks 
              and demonstrates long-term commitment to the project's success.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <h5 className="text-sm font-medium text-foreground mb-1">Supply Transparency</h5>
            <p className="text-xs text-muted-foreground">
              All supply figures are calculated directly from on-chain data. 
              No hardcoded values — what you see is verified blockchain truth.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tokenomics;
