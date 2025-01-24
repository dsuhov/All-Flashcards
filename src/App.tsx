import { useUnit } from 'effector-react';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@gravity-ui/uikit';
import { $settings } from '@/models/settings';

import '@/transport/init';
import '@/i18n/i18n.config';

function App() {
  const settings = useUnit($settings);

  return (
    <ThemeProvider theme={settings.theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
