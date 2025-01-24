import { settingsChecked } from '@/models/settings';

import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/firebase.config';
import { userStatusChecked, userAssigned } from '@/models/auth';
import { UserData } from '@/types/user';

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
