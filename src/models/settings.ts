import { createStore, createEvent, sample, createEffect } from 'effector';

import { UserSettings, UserData } from '@/types/user';
import { DEFAULT_USER_SETTINGS } from '@/constants';
import { $userData } from './auth';

/** Stores */
export const $settings = createStore<UserSettings>(DEFAULT_USER_SETTINGS);

export const settingsUpdated = createEvent<UserSettings>();
export const settingsChecked = createEvent<string>();

/**
 * checks, if there is filled $userData, if so, then apply settings from localStorage to
 * $settings store; if there is no entry in localStorage, make it first with defaults;
 * clear setting on logout
 */

type SettingsFX = {
  userId: UserData['userId'];
  settings: UserSettings;
};

const checkSettingsFx = createEffect<SettingsFX, UserSettings>(
  ({ userId, settings }) => {
    const currentLSSettings = localStorage.getItem(userId);

    if (currentLSSettings === null) {
      localStorage.setItem(userId, JSON.stringify(settings));
      return settings;
    }

    return JSON.parse(currentLSSettings);
  }
);

sample({
  source: settingsChecked,
  filter: (userId) => userId.length !== 0,
  fn: (userId) => {
    return {
      userId: userId,
      settings: { ...DEFAULT_USER_SETTINGS },
    } as SettingsFX;
  },
  target: checkSettingsFx,
});

$settings.on(checkSettingsFx.doneData, (_, settings) => settings);

$settings.on(settingsChecked, (prev, userId) => {
  if (userId.length === 0) {
    return DEFAULT_USER_SETTINGS;
  }

  return prev;
});

export const setSettingsFx = createEffect<SettingsFX, UserSettings>(
  ({ userId, settings }) => {
    localStorage.setItem(userId, JSON.stringify(settings));

    return settings;
  }
);

sample({
  clock: settingsUpdated,
  source: $userData,
  fn: (sourceData, clockData) => {
    return {
      userId: sourceData?.userId,
      settings: { ...clockData },
    } as SettingsFX;
  },
  target: setSettingsFx,
});

$settings.on(setSettingsFx.doneData, (_, settings) => settings);
