import { useUnit } from 'effector-react';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@gravity-ui/uikit';
import { $settings, settingsChecked } from '@/models/settings';

import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/firebase.config';
import { userStatusChecked, userAssigned } from '@/models/auth';
import { UserData } from '@/types/user';
import '@/i18n/i18n.config';

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    userAssigned({
      username: user.email,
      userId: user.uid,
    } as UserData);

    settingsChecked(user.uid);
  } else {
    userAssigned(null);
    settingsChecked('');
  }

  userStatusChecked(true);
});
userStatusChecked(true);

function App() {
  const settings = useUnit($settings);

  return (
    <ThemeProvider theme={settings.theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
