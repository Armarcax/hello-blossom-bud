import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDisplayNumber } from "@/utils/contractHelpers";

interface TokenAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  maxValue: string;
  placeholder?: string;
  disabled?: boolean;
  tokenSymbol?: string;
  label?: string;
}

const TokenAmountInput = ({
  value,
  onChange,
  maxValue,
  placeholder = "Enter amount",
  disabled = false,
  tokenSymbol = "HAYQ",
  label = "Available",
}: TokenAmountInputProps) => {
  const formattedMax = formatDisplayNumber(maxValue, 4);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {label}: {formattedMax} {tokenSymbol}
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={() => onChange(maxValue)}
          className="h-auto p-0 text-xs"
          disabled={disabled}
        >
          Max
        </Button>
      </div>
      <Input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        min="0"
        step="any"
      />
    </div>
  );
};

export default TokenAmountInput;
