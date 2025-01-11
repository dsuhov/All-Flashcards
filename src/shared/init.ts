import { createEvent } from 'effector';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/firebase.config';
import { userStatusChecked, userAssigned } from '@/models/auth';
import { UserData } from '@/types/user';

export const appStarted = createEvent();

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    userAssigned({
      username: user.email,
      userId: user.uid,
    } as UserData);
  } else {
    userAssigned(null);
  }

  userStatusChecked(true);
});
