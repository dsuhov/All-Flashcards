import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeProvider } from '@gravity-ui/uikit';

import '@/i18n/i18n.config';
import { User, UserProps } from '..';
import { UserSettings } from '@/types/user';
import { DEFAULT_USER_SETTINGS } from '@/constants';

describe('User tests', () => {
  const Component = (props: UserProps) => (
    <ThemeProvider theme="light">
      <User {...props} />
    </ThemeProvider>
  );

  const USERNAME = 'Демидрол вонючка';

  it('renders user component with username', () => {
    render(
      <Component
        username={USERNAME}
        onExit={jest.fn()}
        onChangeSettings={jest.fn()}
        userSettings={DEFAULT_USER_SETTINGS}
      />
    );

    const userElement = screen.getByText(USERNAME);
    expect(userElement).toBeInTheDocument();
  });

  it('renders User with menu items', async () => {
    render(
      <Component
        username={USERNAME}
        onExit={jest.fn()}
        onChangeSettings={jest.fn()}
        userSettings={DEFAULT_USER_SETTINGS}
      />
    );

    const userElement = screen.getByText(USERNAME);
    userEvent.click(userElement);
    expect(await screen.findByText('Настройки')).toBeInTheDocument();
    expect(await screen.findByText('Выйти')).toBeInTheDocument();
  });

  it('on Exit callback are called', async () => {
    const onExitMock = jest.fn();

    render(
      <Component
        username={USERNAME}
        onExit={onExitMock}
        onChangeSettings={jest.fn()}
        userSettings={DEFAULT_USER_SETTINGS}
      />
    );

    const userElement = await screen.findByText(USERNAME);
    await userEvent.click(userElement);
    await userEvent.click(screen.getByText('Выйти'));

    expect(onExitMock).toHaveBeenCalledTimes(1);
  });

  it('open settings', async () => {
    render(
      <Component
        username={USERNAME}
        onExit={jest.fn()}
        onChangeSettings={jest.fn()}
        userSettings={DEFAULT_USER_SETTINGS}
      />
    );

    const userElement = screen.getByText(USERNAME);
    await userEvent.click(userElement);
    await userEvent.click(screen.getByText('Настройки'));

    expect(await screen.findByTestId('User.SettingsPanel')).toBeInTheDocument();
  });

  it('change and send settings', async () => {
    const settingsData = {
      theme: 'dark',
      language: 'eng',
      studySessionCards: 0,
    };

    const onChangeSettingsMock = jest.fn(() => Promise.resolve());

    render(
      <Component
        username={USERNAME}
        onExit={jest.fn()}
        onChangeSettings={onChangeSettingsMock}
        userSettings={DEFAULT_USER_SETTINGS}
      />
    );

    const userElement = screen.getByText(USERNAME);
    await userEvent.click(userElement);

    await userEvent.click(screen.getByText('Настройки'));
    await userEvent.click(screen.getByText('English'));
    await userEvent.click(screen.getByText('Темная'));
    await userEvent.click(screen.getByText('Все'));
    await userEvent.click(screen.getByTitle('Применить'));

    expect(onChangeSettingsMock).toHaveBeenCalledWith(settingsData);
  });

  it('change and send default studySessionCards', async () => {
    const initialSettingsData: UserSettings = {
      theme: 'light',
      language: 'rus',
      studySessionCards: 15,
    };

    const settingsData = {
      theme: 'dark',
      language: 'eng',
      studySessionCards: 15,
    };

    const onChangeSettingsMock = jest.fn(() => Promise.resolve());

    render(
      <Component
        username={USERNAME}
        onExit={jest.fn()}
        onChangeSettings={onChangeSettingsMock}
        userSettings={initialSettingsData}
      />
    );

    const userElement = screen.getByText(USERNAME);
    await userEvent.click(userElement);

    await userEvent.click(screen.getByText('Настройки'));
    await userEvent.click(screen.getByText('English'));
    await userEvent.click(screen.getByText('Темная'));
    await userEvent.click(screen.getByText('Все'));
    await userEvent.click(screen.getByText('Все'));
    await userEvent.click(screen.getByTitle('Применить'));

    expect(onChangeSettingsMock).toHaveBeenCalledWith(settingsData);
  });
});
