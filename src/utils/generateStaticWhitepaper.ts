/**
 * Script-like utility to generate a static whitepaper PDF blob.
 * Used to create a downloadable PDF at build time or on-demand.
 */
import { generateWhitepaperPdf } from '@/hooks/useWhitepaperPdf';

export const getWhitepaperPdfBlob = (): Blob => {
  const doc = generateWhitepaperPdf({
    totalSupply: '1,000,000,000',
    circulatingSupply: '~1,000,000',
    lockedSupply: '~999,000,000',
    circulatingPercent: 0.1,
    lockedPercent: 99.9,
    vestingVaultAddress: null,
  });
  return doc.output('blob');
};

export const getWhitepaperPdfDataUri = (): string => {
  const doc = generateWhitepaperPdf({
    totalSupply: '1,000,000,000',
    circulatingSupply: '~1,000,000',
    lockedSupply: '~999,000,000',
    circulatingPercent: 0.1,
    lockedPercent: 99.9,
    vestingVaultAddress: null,
  });
  return doc.output('datauristring');
};
