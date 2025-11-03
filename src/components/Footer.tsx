import { Youtube, Facebook, Instagram, Music2, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* YouTube Video Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-center mb-4">
            HAYQ YouTube Channel
          </h3>
          <div className="aspect-video max-w-3xl mx-auto bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Youtube className="w-16 h-16 mx-auto mb-2" />
              <p>YouTube video will be embedded here</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <a
            href="#youtube"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="w-6 h-6" />
            <span className="text-sm">YouTube</span>
          </a>
          <a
            href="#facebook"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-6 h-6" />
            <span className="text-sm">Facebook</span>
          </a>
          <a
            href="#instagram"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
            <span className="text-sm">Instagram</span>
          </a>
          <a
            href="#tiktok"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="TikTok"
          >
            <Music2 className="w-6 h-6" />
            <span className="text-sm">TikTok</span>
          </a>
          <a
            href="#twitter"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-6 h-6" />
            <span className="text-sm">Twitter</span>
          </a>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HAYQ Token. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;