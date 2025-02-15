import { FC, useState, ChangeEvent, useMemo } from 'react';
import {
  Button,
  Box,
  Flex,
  Text,
  RadioGroup,
  RadioGroupOption,
  Slider,
} from '@gravity-ui/uikit';

import { SettingsPanelProps } from './interfaces';
import { DEFAULT_TEST_ID } from '../../constants';

import { useTranslation } from 'react-i18next';

export const SettingsPanel: FC<SettingsPanelProps> = (props) => {
  const { t } = useTranslation();
  const { onClose, onChangeSettings, userSettings } = props;

  const [options, setOptions] = useState(userSettings);

  const langOptions: RadioGroupOption[] = useMemo(
    () => [
      { content: 'Русский', value: 'rus' },
      { content: 'English', value: 'eng' },
    ],
    []
  );

  const themeOptions: RadioGroupOption[] = useMemo(
    () => [
      { content: t('settings.light'), value: 'light' },
      { content: t('settings.dark'), value: 'dark' },
    ],
    [t]
  );

  const onChangeSettingsHandler = () => {
    onChangeSettings(options).then(() => onClose());
  };

  const onRadioChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    const name = evt.target.name;

    setOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onCardsChangeHandler = (value: number | [number, number]) => {
    setOptions((prev) => ({
      ...prev,
      studySessionCards: value as number,
    }));
  };

  return (
    <Box spacing={{ p: 4 }} data-testid={DEFAULT_TEST_ID}>
      <Flex direction="column" gap={3}>
        <Box>
          <Box spacing={{ mb: 2 }}>
            <Text variant="subheader-2">{t('settings.lang')}</Text>
          </Box>
          <RadioGroup
            name="language"
            defaultValue={options.language}
            options={langOptions}
            onChange={onRadioChange}
          />
        </Box>
        <Box>
          <Box spacing={{ mb: 2 }}>
            <Text variant="subheader-2">{t('settings.theme')}</Text>
          </Box>
          <RadioGroup
            name="theme"
            defaultValue={options.theme}
            options={themeOptions}
            onChange={onRadioChange}
          />
        </Box>
        <Box>
          <Box spacing={{ mb: 2 }}>
            <Text variant="subheader-2">{t('settings.cardsToLearn')}</Text>
          </Box>
          <Box spacing={{ mb: 2 }}>
            <Slider
              min={5}
              max={20}
              step={5}
              hasTooltip
              marks={[5, 10, 15, 20]}
              onUpdate={onCardsChangeHandler}
              defaultValue={options.studySessionCards}
            />
          </Box>
        </Box>
        <Flex gap={2}>
          <Button
            size="l"
            onClick={onClose}
            title={t('common.cancel')}
            width="max"
          >
            {t('common.cancel')}
          </Button>
          <Button
            width="max"
            size="l"
            view="action"
            title={t('common.apply')}
            onClick={onChangeSettingsHandler}
          >
            {t('common.apply')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
