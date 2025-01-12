import { FC, useState, ChangeEvent } from 'react';
import {
  Button,
  Box,
  Flex,
  Text,
  RadioGroup,
  RadioGroupOption,
  Slider,
  Checkbox,
} from '@gravity-ui/uikit';

import { SettingsPanelProps } from './interfaces';
import { DEFAULT_TEST_ID } from '../../constants';

const langOptions: RadioGroupOption[] = [
  { content: 'Русский', value: 'rus' },
  { content: 'Английский', value: 'eng' },
];

const themeOptions: RadioGroupOption[] = [
  { content: 'Светлая', value: 'light' },
  { content: 'Темная', value: 'dark' },
];

export const SettingsPanel: FC<SettingsPanelProps> = (props) => {
  const { onClose, onChangeSettings, userSettings } = props;

  const [options, setOptions] = useState(userSettings);
  const [slider, setSlider] = useState(userSettings.studySessionCards || 5);

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

    setSlider(value as number);
  };

  const onAllCardshandler = (evt: ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.target.checked;

    setOptions((prev) => ({
      ...prev,
      studySessionCards: isChecked ? 0 : slider,
    }));
  };

  return (
    <Box spacing={{ p: 4 }} data-testid={DEFAULT_TEST_ID}>
      <Flex direction="column" gap={3}>
        <Box>
          <Box spacing={{ mb: 2 }}>
            <Text variant="subheader-2">Язык</Text>
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
            <Text variant="subheader-2">Тема</Text>
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
            <Text variant="subheader-2">Карточек для изучения</Text>
          </Box>
          <Box spacing={{ mb: 2 }}>
            <Slider
              min={5}
              max={20}
              step={5}
              hasTooltip
              marks={[5, 10, 15, 20]}
              onUpdate={onCardsChangeHandler}
              defaultValue={
                options.studySessionCards !== 0 ? options.studySessionCards : 5
              }
              disabled={options.studySessionCards === 0}
            />
          </Box>
          <Checkbox
            onChange={onAllCardshandler}
            checked={options.studySessionCards === 0}
          >
            Все
          </Checkbox>
        </Box>
        <Flex gap={2}>
          <Button size="l" onClick={onClose} title="Отмена">
            Отмена
          </Button>
          <Button
            size="l"
            view="action"
            title="Применить"
            onClick={onChangeSettingsHandler}
          >
            Применить
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
