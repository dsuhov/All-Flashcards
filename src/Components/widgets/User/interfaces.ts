import { UserSettings } from '@/types/user';

export interface UserProps {
  username: string;
  onExit: () => void;
  onChangeSettings: (userSettings: UserSettings) => Promise<void>;
  userSettings: UserSettings;
}
