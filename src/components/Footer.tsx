import { Youtube, Facebook, Instagram, Music2, Twitter } from "lucide-react";
import WhitepaperDownload from "@/components/WhitepaperDownload";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Whitepaper Download */}
        <div className="flex justify-center mb-8">
          <WhitepaperDownload variant="compact" />
        </div>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <SocialLink href="https://youtube.com/@hayq" icon={Youtube} label="YouTube" />
          <SocialLink href="https://facebook.com/hayqtoken" icon={Facebook} label="Facebook" />
          <SocialLink href="https://instagram.com/hayqtoken" icon={Instagram} label="Instagram" />
          <SocialLink href="https://tiktok.com/@hayqtoken" icon={Music2} label="TikTok" />
          <SocialLink href="https://twitter.com/hayq_token" icon={Twitter} label="Twitter" />
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HAYQ Token. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  href: string;
  icon: typeof Youtube;
  label: string;
}

const SocialLink = ({ href, icon: Icon, label }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </a>
);

export default Footer;