import { t } from 'i18next';
import { toaster } from '@/shared/toaster';
import { i18n } from '@/i18n/i18n.config';
import { createEffect, createEvent } from 'effector';

export const errorHasGottenEvt = createEvent<string>();

export const showErrorFx = createEffect<string, void>((errMsg) => {
  console.error('Error: ', errMsg);

  toaster.add({
    name: i18n.t('error'),
    title: errMsg,
    content: t('dataError'),
    theme: 'danger',
    autoHiding: 10000,
    isClosable: false,
  });
});
