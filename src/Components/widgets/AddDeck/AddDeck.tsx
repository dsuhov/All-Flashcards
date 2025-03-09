import { useRef, KeyboardEvent } from 'react';

import { Box, Flex, Button, TextInput, Popup } from '@gravity-ui/uikit';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import { AddDeckProps } from './interfaces';
import styles from './styles.module.css';

export const AddDeck = (props: AddDeckProps) => {
  const {
    className,
    onAddDeckClick,
    inputFieldOpen,
    onDeckNameInputChange,
    deckNameNameValue,
    onSave,
    pending,
    closePopup,
    error,
  } = props;

  const buttonRef = useRef(null);
  const { t } = useTranslation();

  const onDeckNameKeyHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.code === 'Enter') {
      onSave();
    }
  };

  return (
    <Box className={cn(styles.addDeck, className)}>
      <Flex spacing={{ p: 2 }} justifyContent="flex-end" gap={2}>
        <Button
          ref={buttonRef}
          onClick={onAddDeckClick}
          view="action"
          disabled={pending}
        >
          {t('add_deck.add')}
        </Button>
        <Popup
          anchorRef={buttonRef}
          open={inputFieldOpen}
          placement="bottom-end"
          onOutsideClick={pending ? undefined : closePopup}
          className={styles.input}
        >
          <Flex gap={1} spacing={{ p: 1 }}>
            <TextInput
              autoFocus
              size="s"
              disabled={pending}
              placeholder={t('add_deck.deck_name_plch')}
              onChange={onDeckNameInputChange}
              value={deckNameNameValue}
              onKeyPress={onDeckNameKeyHandler}
              validationState={error ? 'invalid' : undefined}
              errorMessage={error}
            />
            <Button
              view="outlined-action"
              size="s"
              title={t('add_deck.input_title')}
              onClick={onSave}
              loading={pending}
            >
              {t('common.save')}
            </Button>
          </Flex>
        </Popup>
      </Flex>
    </Box>
  );
};
