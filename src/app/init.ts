import { watchAuthState } from '../services/watchAuthState';

import '@/i18n/i18n.config';

export const init = () => {
  watchAuthState();
};
