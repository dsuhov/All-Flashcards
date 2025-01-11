import { createEffect } from 'effector';
import { collection, addDoc } from 'firebase/firestore';

import { AuthData, UserData } from '@/types/user';
import { firebaseAuth, db } from '@/firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// assigning UserData in init.ts

export const loginFx = createEffect<AuthData, void, Error>(
  async ({ email, password }) => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);
  }
);

export const signinFx = createEffect<AuthData, void, Error>(
  async ({ email, password }) => {
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

    await addDoc(collection(db, 'users'), newUser);
  }
);
