import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTokenomics, formatSupply } from '@/hooks/useTokenomics';
import { downloadWhitepaperPdf } from '@/hooks/useWhitepaperPdf';
import { toast } from 'sonner';

interface WhitepaperDownloadProps {
  variant?: 'default' | 'compact';
}

const WhitepaperDownload = ({ variant = 'default' }: WhitepaperDownloadProps) => {
  const { data: tokenomics, isLoading } = useTokenomics();

  const handleDownload = () => {
    try {
      const pdfData = tokenomics ? {
        totalSupply: formatSupply(tokenomics.totalSupply),
        circulatingSupply: formatSupply(tokenomics.circulatingSupply),
        lockedSupply: formatSupply(tokenomics.lockedSupply),
        circulatingPercent: tokenomics.circulatingPercent,
        lockedPercent: tokenomics.lockedPercent,
        vestingVaultAddress: tokenomics.vestingVaultAddress,
      } : undefined;

      downloadWhitepaperPdf(pdfData);
      toast.success('Whitepaper downloaded successfully');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to generate whitepaper');
    }
  };

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={isLoading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
      <div className="p-3 rounded-lg bg-primary/10">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">HAYQ Whitepaper</h4>
        <p className="text-sm text-muted-foreground">
          Download the complete tokenomics documentation as PDF
        </p>
      </div>
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
};

export default WhitepaperDownload;
