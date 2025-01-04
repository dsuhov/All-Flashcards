import { UserSettings } from '@/types/user';

export interface SettingsPanelProps {
  onClose: () => void;
  onChangeSettings: (userSettings: UserSettings) => Promise<void>;
  userSettings: UserSettings;
}
