import { Card, Flex, Text, TextInput, Button, Alert } from '@gravity-ui/uikit';
import { useState, FormEvent } from 'react';
import { useUnit } from 'effector-react';

import {
  $email,
  $emailError,
  $password,
  $passwordError,
  $error,
  $webauthnPending,
  emailChanged,
  passwordChanged,
  formSubmitted,
} from '@/models/auth';

import { fieldsErrors } from './constants';

export const AuthForm = () => {
  const [isRegistration, setIsregistration] = useState(false);
  const [
    email,
    password,
    emailError,
    passwordError,
    error,
    pending,
    handleEmailChange,
    handlePasswordChange,
    fandleFormSUbmit,
  ] = useUnit([
    $email,
    $password,
    $emailError,
    $passwordError,
    $error,
    $webauthnPending,
    emailChanged,
    passwordChanged,
    formSubmitted,
  ]);

  const onSubmitHandler = (evt: FormEvent) => {
    evt.preventDefault();
    fandleFormSUbmit(isRegistration ? 'signin' : 'login');
  };

  return (
    <Card spacing={{ p: 4 }} size="m">
      <form onSubmit={onSubmitHandler}>
        <Flex direction="column" gap={2}>
          <Text variant="subheader-3">
            {isRegistration ? 'Регистрация' : 'Вход'}
          </Text>
          <TextInput
            label="Почта"
            value={email}
            name="Почта"
            type="email"
            onChange={(evt) => handleEmailChange(evt.target.value)}
            validationState={emailError ? 'invalid' : undefined}
            errorMessage={emailError && fieldsErrors[emailError]}
            disabled={pending}
          />
          <TextInput
            label="Пароль"
            type="password"
            value={password}
            name="Пароль"
            onChange={(evt) => handlePasswordChange(evt.target.value)}
            validationState={passwordError ? 'invalid' : undefined}
            errorMessage={passwordError && fieldsErrors[passwordError]}
            disabled={pending}
          />
          {error && (
            <Alert
              view="outlined"
              theme="danger"
              title="Ошибка"
              message={error}
            />
          )}
          <Button
            view="flat"
            type="button"
            onClick={() => setIsregistration((prev) => !prev)}
            disabled={pending}
          >
            {isRegistration ? 'Вход' : 'Регистрация'}
          </Button>
          <Flex gap={2}>
            <Button
              type="submit"
              title="Войти"
              view="action"
              width="max"
              loading={pending}
            >
              {isRegistration ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
};
