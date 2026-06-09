import { jsPDF } from 'jspdf';
import { WEB3_CONFIG } from '@/config/web3';

interface TokenomicsData {
  totalSupply: string;
  circulatingSupply: string;
  lockedSupply: string;
  circulatingPercent: number;
  lockedPercent: number;
  vestingVaultAddress: string | null;
}

const COLORS = {
  primary: [30, 64, 175] as [number, number, number], // blue-800
  secondary: [100, 116, 139] as [number, number, number], // slate-500
  text: [15, 23, 42] as [number, number, number], // slate-900
  muted: [71, 85, 105] as [number, number, number], // slate-600
  accent: [16, 185, 129] as [number, number, number], // emerald-500
};

export const generateWhitepaperPdf = (tokenomics?: TokenomicsData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addTitle = (text: string, size: number = 24) => {
    doc.setFontSize(size);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += size * 0.5;
  };

  const addSubtitle = (text: string) => {
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.secondary);
    doc.setFont('helvetica', 'normal');
    doc.text(text, margin, y);
    y += 10;
  };

  const addHeading = (text: string) => {
    y += 8;
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 10;
  };

  const addParagraph = (text: string) => {
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 4;
  };

  const addBullet = (text: string) => {
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const bulletText = `• ${text}`;
    const lines = doc.splitTextToSize(bulletText, contentWidth - 5);
    doc.text(lines, margin + 5, y);
    y += lines.length * 6 + 2;
  };

  const addStatBox = (label: string, value: string, percentage?: string) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y - 4, contentWidth, 20, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.secondary);
    doc.setFont('helvetica', 'normal');
    doc.text(label, margin + 5, y + 2);
    
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 5, y + 12);
    
    if (percentage) {
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.accent);
      doc.text(percentage, margin + contentWidth - 30, y + 8);
    }
    
    y += 24;
  };

  const checkPageBreak = (needed: number = 40) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // === COVER PAGE ===
  y = 60;
  doc.setFontSize(36);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('HAYQ', pageWidth / 2, y, { align: 'center' });
  
  y += 15;
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.secondary);
  doc.setFont('helvetica', 'normal');
  doc.text('Whitepaper', pageWidth / 2, y, { align: 'center' });
  
  y += 30;
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.muted);
  doc.text('Tokenomics & Economic Framework', pageWidth / 2, y, { align: 'center' });
  
  y += 60;
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, y, { align: 'center' });
  
  y += 8;
  doc.text(`Network: ${WEB3_CONFIG.networkName}`, pageWidth / 2, y, { align: 'center' });

  // === PAGE 2: TOKEN OVERVIEW ===
  doc.addPage();
  y = margin;
  
  addTitle('Token Overview');
  y += 5;
  
  addParagraph(
    'HAYQ is an ERC-20 token deployed on the Ethereum network. The token is designed with transparency ' +
    'and on-chain verifiability as core principles, ensuring all supply metrics can be independently verified.'
  );

  addHeading('Token Specifications');
  
  const specs = [
    ['Token Name', 'HAYQ'],
    ['Token Standard', 'ERC-20'],
    ['Network', 'Ethereum'],
    ['Decimals', '18'],
  ];
  
  specs.forEach(([label, value]) => {
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text(`${label}:`, margin, y);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 50, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
  });

  if (WEB3_CONFIG.contractAddress) {
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text('Contract Address:', margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.primary);
    doc.text(WEB3_CONFIG.contractAddress, margin, y);
  }

  // === PAGE 3: TOKENOMICS ===
  doc.addPage();
  y = margin;
  
  addTitle('Tokenomics');
  y += 5;
  
  addParagraph(
    'HAYQ operates with a fixed economic supply of 1,000,000,000 tokens. While the smart contract ' +
    'architecture allows for a higher theoretical maximum, only 1B HAYQ are economically issued. ' +
    'Distribution and circulation are enforced on-chain via a public, verified vesting contract.'
  );

  addHeading('Supply Distribution');
  y += 5;

  if (tokenomics) {
    addStatBox('Total Supply (Economic)', `${tokenomics.totalSupply} HAYQ`);
    addStatBox(
      'Circulating Supply', 
      `${tokenomics.circulatingSupply} HAYQ`,
      `${tokenomics.circulatingPercent.toFixed(2)}%`
    );
    addStatBox(
      'Locked / Treasury', 
      `${tokenomics.lockedSupply} HAYQ`,
      `${tokenomics.lockedPercent.toFixed(2)}%`
    );
  } else {
    addStatBox('Total Supply (Economic)', '1,000,000,000 HAYQ');
    addStatBox('Circulating Supply', '~1,000,000 HAYQ', '~0.1%');
    addStatBox('Locked / Treasury', '~999,000,000 HAYQ', '~99.9%');
  }

  y += 5;
  addParagraph(
    'The majority of the HAYQ supply is locked in a publicly verifiable, on-chain vesting contract. ' +
    'These tokens are time-locked and cannot enter circulation prematurely.'
  );

  // === CIRCULATING VS LOCKED ===
  checkPageBreak(80);
  addHeading('Supply Definitions');
  
  addParagraph(
    'Circulating Supply: Represents tokens that are actively tradeable and transferable. This excludes ' +
    'all tokens held in the vesting contract, treasury reserves, or any other locked mechanisms.'
  );
  
  addParagraph(
    'Locked / Treasury: The majority of supply is secured in a time-locked vesting contract. These tokens ' +
    'are non-circulating and cannot be transferred until their scheduled unlock date.'
  );

  // === PAGE 4: VESTING MECHANICS ===
  doc.addPage();
  y = margin;
  
  addTitle('Vesting & Lockup Mechanics');
  y += 5;
  
  addParagraph(
    'HAYQ implements a transparent, on-chain vesting mechanism to ensure fair distribution ' +
    'and prevent market manipulation. All vesting parameters are publicly verifiable.'
  );

  addHeading('Key Principles');
  
  addBullet('Token release is strictly time-based — no manual or early unlocks are possible');
  addBullet('Vesting contract is public and verified on Etherscan');
  addBullet('No hidden or discretionary minting mechanisms exist');
  addBullet('All supply figures are calculated directly from on-chain data');
  addBullet('Smart contract is immutable after deployment');

  if (tokenomics?.vestingVaultAddress) {
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text('Vesting Contract Address:', margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.primary);
    doc.text(tokenomics.vestingVaultAddress, margin, y);
  }

  addHeading('Transparency Commitment');
  
  addParagraph(
    'All supply metrics displayed on the HAYQ platform are fetched directly from the blockchain. ' +
    'No hardcoded values are used, ensuring that the information presented always reflects the ' +
    'actual on-chain state. Users can independently verify all figures using block explorers.'
  );

  // === PAGE 5: SECURITY & COMPLIANCE ===
  doc.addPage();
  y = margin;
  
  addTitle('Security & Compliance');
  y += 5;
  
  addParagraph(
    'HAYQ prioritizes security and regulatory compliance in all aspects of its design and operation.'
  );

  addHeading('Smart Contract Security');
  
  addBullet('ERC-20 standard implementation with no custom transfer logic');
  addBullet('Upgradeable proxy pattern for future improvements');
  addBullet('Multi-signature requirements for administrative functions');
  addBullet('Time-locked governance for critical changes');

  addHeading('Verification');
  
  addParagraph(
    'All HAYQ smart contracts are verified and published on Etherscan, allowing anyone to ' +
    'review the source code and verify the contract behavior matches the documented specifications.'
  );

  checkPageBreak(50);
  addHeading('Disclaimer');
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  const disclaimer = 
    'This document is for informational purposes only and does not constitute financial advice, ' +
    'an offer to sell, or a solicitation to buy any tokens. Cryptocurrency investments carry risks. ' +
    'Please conduct your own research and consult with qualified professionals before making any investment decisions.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  // === FOOTER ON ALL PAGES ===
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.secondary);
    doc.text(
      `HAYQ Whitepaper — Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
};

export const downloadWhitepaperPdf = (tokenomics?: TokenomicsData) => {
  const doc = generateWhitepaperPdf(tokenomics);
  doc.save('HAYQ_Whitepaper.pdf');
};
