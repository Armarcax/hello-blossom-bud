import { useEffect } from 'react';
import { getWhitepaperPdfBlob } from '@/utils/generateStaticWhitepaper';

/**
 * Whitepaper PDF page — generates and opens the PDF directly in the browser.
 * Accessible at /whitepaper.pdf without authentication.
 */
const WhitepaperPdf = () => {
  useEffect(() => {
    const blob = getWhitepaperPdfBlob();
    const url = URL.createObjectURL(blob);
    window.location.replace(url);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <p>Generating whitepaper PDF…</p>
    </div>
  );
};

export default WhitepaperPdf;
