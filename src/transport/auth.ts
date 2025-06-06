import { setDoc, doc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { USERS_COLLECTION } from '@/constants';
import { AuthData, UserData } from '@/types/user';
import { firebaseAuth, db } from '@/firebase.config';

export const doLogin = async ({ email, password }: AuthData): Promise<void> => {
  await signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const doSignIn = async ({
  email,
  password,
}: AuthData): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  const newUser: UserData = {
    username:
      userCredential.user.displayName ||
      userCredential.user.email ||
      'unknown user',
    userId: userCredential.user.uid,
  };

  await setDoc(doc(db, USERS_COLLECTION, userCredential.user.uid), newUser);
};
