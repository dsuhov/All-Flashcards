import { UserSettings } from '@/types/user';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'rus',
  studySessionCards: 5,
} as const;

export const LEARN_ROUTE = 'learn';
export const DECKS_ROUTE = 'decks';

export const USERS_COLLECTION = 'users';
export const DECKS_COLLEACTION = 'decks';
export const BOXES_COLLECTION = 'boxes';
export const ENTRIES_COLLECTION = 'entries';
