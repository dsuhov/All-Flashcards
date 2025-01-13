import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { translations } from './translations';

i18n.use(initReactI18next).init({
  resources: translations,

  lng: 'rus',
  fallbackLng: 'rus',

  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
