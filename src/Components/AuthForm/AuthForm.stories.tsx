import type { Meta, StoryObj } from '@storybook/react';

import { fork } from 'effector';
import { Provider } from 'effector-react';

import { AuthForm } from './AuthForm';
import { loginFx, signinFx } from '@/transport/auth';
import { $webauthnPending, $email, $password } from '@/models/auth';

type Story = StoryObj<typeof AuthForm>;

const meta: Meta<typeof AuthForm> = {
  title: 'Auth Form',
  component: AuthForm,
  parameters: {
    layout: 'centered',
  },
};

const scopeHappy = fork({
  handlers: [
    [loginFx, () => undefined],
    [signinFx, () => undefined],
  ],
});

const scopeBad = fork({
  handlers: [
    [
      loginFx,
      () => {
        throw new Error('Login error');
      },
    ],
    [
      signinFx,
      () => {
        throw new Error('Register error');
      },
    ],
  ],
  values: [
    [$email, 'some@email.ru'],
    [$password, 'password'],
  ],
});

const scopePending = fork({
  handlers: [
    [loginFx, () => undefined],
    [signinFx, () => undefined],
  ],
  values: [[$webauthnPending, true]],
});

export const AuthFormStory: Story = {
  decorators: [
    (Story) => (
      <Provider value={scopeHappy}>
        <Story />
      </Provider>
    ),
  ],
};

export const AuthFormError: Story = {
  decorators: [
    (Story) => (
      <Provider value={scopeBad}>
        <Story />
      </Provider>
    ),
  ],
};

export const AuthFormPending: Story = {
  decorators: [
    (Story) => (
      <Provider value={scopePending}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;