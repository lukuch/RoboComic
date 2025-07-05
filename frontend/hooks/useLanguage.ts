import { useState } from 'react';
import { LANGUAGES } from '../app/Home/translations';
import { DEFAULTS } from '../constants';

export function useLanguage(initialLang: string = DEFAULTS.LANGUAGE) {
  const [lang, setLang] = useState(initialLang);

  const currentLanguage = LANGUAGES.find(l => l.code === lang)!;

  return {
    lang,
    setLang,
    currentLanguage,
  };
} 