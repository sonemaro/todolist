import { useAppStore } from '../stores/useAppStore';
import { translations, TranslationKey } from '../locales';

export const useTranslation = () => {
  const language = useAppStore((state) => state.preferences.language);
  const calendarType = useAppStore((state) => state.preferences.calendarType);
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const isRTL = language === 'fa';
  
  return { t, language, isRTL, calendarType };
};