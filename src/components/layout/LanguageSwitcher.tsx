import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const SUPPORTED_LANGUAGES = ["en", "hy", "ru", "fr", "es", "de", "zh", "ja", "ar"] as const;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex justify-center gap-2 flex-wrap max-w-2xl mx-auto">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <Button
          key={lang}
          size="sm"
          variant="ghost"
          onClick={() => changeLanguage(lang)}
          className={`rounded-full border-2 transition-all hover:scale-110 ${
            i18n.language === lang
              ? "border-primary bg-primary text-primary-foreground"
              : "border-primary/20 bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary"
          }`}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
