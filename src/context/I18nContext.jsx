import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations, defaultLang } from '../i18n';

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('islamediaku_language') || defaultLang;
  });

  useEffect(() => {
    localStorage.setItem('islamediaku_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key) => {
    const dict = translations[language] || translations[defaultLang];
    return dict[key] || translations[defaultLang][key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Helper for Friday Prayer
export const getPrayerDisplayName = (prayerKey, date, language, t) => {
  const isFriday = date.getDay() === 5;
  if (prayerKey === 'Dhuhr' && isFriday) {
    return t('prayer.jumuah');
  }
  // The translations keys are mostly lowercase 'fajr', 'dhuhr' etc.
  const lowerKey = prayerKey.toLowerCase();
  return t(`prayer.${lowerKey}`);
};
