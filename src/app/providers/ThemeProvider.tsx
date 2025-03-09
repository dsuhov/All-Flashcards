import { ReactNode } from 'react';
import { ThemeProvider as GUIThemeProvider } from '@gravity-ui/uikit';
import { useUnit } from 'effector-react';

import { $settings } from '@/models/settings';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const settings = useUnit($settings);

  return <GUIThemeProvider theme={settings.theme}>{children}</GUIThemeProvider>;
};
