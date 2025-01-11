export interface UserSettings {
  theme: 'dark' | 'light';
  language: 'rus' | 'eng';
  studySessionCards: number;
}

export interface AuthData {
  email: string;
  password: string;
}

export interface UserData {
  username: string;
  userId: string;
}
