import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Provider } from 'effector-react';
import { ThemeProvider } from '@gravity-ui/uikit';

import '@/i18n/i18n.config';
import { AuthForm } from '../AuthForm';
import { loginFx, signinFx } from '@/models/auth';
import { fork, Scope } from 'effector';
import { $webauthnPending } from '@/models/auth';
import { fieldsErrors } from '../constants';
import { AuthData } from '@/types/user';

jest.mock('../../../firebase.config.ts', () => {
  return {};
});

window.ResizeObserver =
  window.ResizeObserver ||
  jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
  }));

describe('AuthForm test', () => {
  const ENTER = 'Вход';
  const ENTER_BTN_TEXT = 'Войти';
  const REGISTER_BTN_TEXT = 'Зарегистрироваться';
  const REGISTER = 'Регистрация';
  const EMAIL_LABEL = 'Почта';
  const PASSW_LABEL = 'Пароль';

  const ERROR_TEXT_LOGIN = 'effect login error';
  const ERROR_TEXT_SIGNIN = 'effect signin error';
  const WRONG_EMAIL = 'qwerty@sdfsdf';
  const SHORT_PASSWORD = 'qwe';
  const EMAIL = 'test@test.com';
  const PASSWORD = 'qwerty123';

  const Component = ({ scope }: { scope: Scope }) => (
    <ThemeProvider theme="light">
      <Provider value={scope}>
        <AuthForm />
      </Provider>
    </ThemeProvider>
  );

  it('AuthForm renders', () => {
    const scope = fork();

    render(<Component scope={scope} />);

    expect(screen.getByText(ENTER)).toBeInTheDocument();
    expect(screen.getByText(EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByText(PASSW_LABEL)).toBeInTheDocument();

    expect(screen.getByTitle(REGISTER)).toBeInTheDocument();
    expect(screen.getByTitle(ENTER_BTN_TEXT)).toBeInTheDocument();
  });

  it('switch to registration', async () => {
    const scope = fork();

    render(<Component scope={scope} />);

    await userEvent.click(screen.getByText(REGISTER));

    expect(screen.getByText(REGISTER)).toBeInTheDocument();
    expect(screen.getByText(EMAIL_LABEL)).toBeInTheDocument();
    expect(screen.getByText(PASSW_LABEL)).toBeInTheDocument();

    expect(screen.getByTitle(ENTER)).toBeInTheDocument();
    expect(screen.getByTitle(REGISTER_BTN_TEXT)).toBeInTheDocument();
  });

  it('form fields filled', async () => {
    let emailValue = '';
    let passwordValue = '';

    const scope = fork({
      handlers: [
        [
          loginFx,
          ({ email, password }: AuthData) => {
            emailValue = email;
            passwordValue = password;
          },
        ],
        [signinFx, () => undefined],
      ],
    });
    const { container } = render(<Component scope={scope} />);

    const emailField = container.querySelector(
      'input[name=Почта]'
    ) as HTMLInputElement;
    const passwordField = container.querySelector(
      'input[name=Пароль]'
    ) as HTMLInputElement;

    await userEvent.type(emailField, EMAIL);
    await userEvent.type(passwordField, PASSWORD);
    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));

    expect(emailValue).toBe(EMAIL);
    expect(passwordValue).toBe(PASSWORD);
  });

  it('empty fields error', async () => {
    const scope = fork();

    render(<Component scope={scope} />);

    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));

    expect(screen.getAllByText(fieldsErrors.empty)).toHaveLength(2);
  });

  it('wrong email', async () => {
    const scope = fork();

    const { container } = render(<Component scope={scope} />);

    const emailField = container.querySelector(
      'input[name=Почта]'
    ) as HTMLInputElement;

    await userEvent.type(emailField, WRONG_EMAIL);
    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));

    expect(screen.getByText(fieldsErrors.wrongEmail)).toBeInTheDocument();
  });

  it('too short password', async () => {
    const scope = fork();

    const { container } = render(<Component scope={scope} />);

    const passwordField = container.querySelector(
      'input[name=Пароль]'
    ) as HTMLInputElement;

    await userEvent.type(passwordField, SHORT_PASSWORD);
    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));

    expect(screen.getByText(fieldsErrors.tooShort)).toBeInTheDocument();
  });

  it('when begin typing field errors is off', async () => {
    const scope = fork();

    const { container } = render(<Component scope={scope} />);

    const emailField = container.querySelector(
      'input[name=Почта]'
    ) as HTMLInputElement;

    await userEvent.type(emailField, EMAIL);
    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));
    await userEvent.type(emailField, EMAIL);

    expect(screen.queryByText(fieldsErrors.wrongEmail)).not.toBeInTheDocument();
  });

  it('login error', async () => {
    const scope = fork({
      handlers: [
        [
          loginFx,
          () => {
            throw new Error(ERROR_TEXT_LOGIN);
          },
        ],
      ],
    });

    const { container } = render(<Component scope={scope} />);

    const emailField = container.querySelector(
      'input[name=Почта]'
    ) as HTMLInputElement;
    const passwordField = container.querySelector(
      'input[name=Пароль]'
    ) as HTMLInputElement;

    await userEvent.type(emailField, EMAIL);
    await userEvent.type(passwordField, PASSWORD);
    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));

    expect(screen.getByText(ERROR_TEXT_LOGIN)).toBeInTheDocument();
  });

  it('signIn  error', async () => {
    const scope = fork({
      handlers: [
        [
          signinFx,
          () => {
            throw new Error(ERROR_TEXT_SIGNIN);
          },
        ],
      ],
    });

    const { container } = render(<Component scope={scope} />);

    const emailField = container.querySelector(
      'input[name=Почта]'
    ) as HTMLInputElement;
    const passwordField = container.querySelector(
      'input[name=Пароль]'
    ) as HTMLInputElement;

    await userEvent.type(emailField, EMAIL);
    await userEvent.type(passwordField, PASSWORD);
    await userEvent.click(screen.getByText(REGISTER));
    await userEvent.click(screen.getByText(REGISTER_BTN_TEXT));

    expect(screen.getByText(ERROR_TEXT_SIGNIN)).toBeInTheDocument();
  });

  it('form is pending', async () => {
    const scope = fork({
      values: [[$webauthnPending, true]],
    });

    render(<Component scope={scope} />);

    await userEvent.click(screen.getByText(ENTER_BTN_TEXT));

    expect(screen.getByTitle(ENTER_BTN_TEXT)).toHaveAttribute('disabled');
  });
});
