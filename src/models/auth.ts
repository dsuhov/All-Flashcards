import { createStore, createEvent, combine, sample } from 'effector';
import { every, or, reset } from 'patronum';

import { UserData } from '@/types/user';
import { loginFx, signinFx } from '@/transport/auth';

export const $userData = createStore<UserData | null>(null);
export const userAssigned = createEvent<UserData | null>();

export const $userStatus = createStore(false);
export const userStatusChecked = createEvent<boolean>();

export const $email = createStore('');
export const $emailError = createStore<null | 'empty' | 'wrongEmail'>(null);

export const $password = createStore('');
export const $passwordError = createStore<null | 'empty' | 'tooShort'>(null);

export const $webauthnPending = createStore(false);
export const $error = createStore('');

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent<'login' | 'signin'>();

$userStatus.on(userStatusChecked, (_, isStatusChecked) => isStatusChecked);
$userData.on(userAssigned, (_, userData) => userData);

// reset error when start typing
reset({
  clock: [$email, $password],
  target: [$emailError, $passwordError],
});

const $formValid = every({
  stores: [$emailError, $passwordError],
  predicate: null,
});

$email.on(emailChanged, (_, value) => value);
$password.on(passwordChanged, (_, value) => value);

sample({
  clock: formSubmitted,
  source: $email,
  fn: (email) => {
    if (isEmpty(email)) return 'empty';
    if (isBadEmail(email)) return 'wrongEmail';
    return null;
  },
  target: $emailError,
});

sample({
  clock: formSubmitted,
  source: $password,
  fn: (password) => {
    if (isEmpty(password)) return 'empty';
    if (isBadLength(password)) return 'tooShort';
    return null;
  },
  target: $passwordError,
});

sample({
  clock: formSubmitted,
  source: combine({ email: $email, password: $password }),
  filter: (_, clockData) => $formValid.getState() && clockData === 'login',
  target: loginFx,
});

sample({
  clock: formSubmitted,
  source: combine({ email: $email, password: $password }),
  filter: (_, clockData) => $formValid.getState() && clockData === 'signin',
  target: signinFx,
});

sample({
  clock: or(signinFx.pending, loginFx.pending),
  target: $webauthnPending,
});

$error.on(
  [signinFx.failData, loginFx.failData],
  (_, payload) => payload.message
);

reset({
  clock: [signinFx.done, loginFx.done],
  target: [$emailError, $passwordError, $email, $password],
});

reset({
  clock: formSubmitted,
  target: $error,
});

function isEmpty(input: string) {
  return input.trim().length === 0;
}

function isBadLength(input: string) {
  return input.trim().length < 6;
}

function isBadEmail(input: string) {
  return !/(.+)@(.+)\.(.+){2,}/.test(input);
}
