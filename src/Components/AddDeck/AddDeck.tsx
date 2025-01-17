import { KeyboardEvent } from 'react';
import { Box, Flex, Button, TextInput, Icon } from '@gravity-ui/uikit';
import { Magnifier } from '@gravity-ui/icons';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

import { AddDeckProps } from './interfaces';
import styles from './styles.module.css';

export const AddDeck = (props: AddDeckProps) => {
  const { className, onAddDeckClick } = props;

  const { t } = useTranslation();

  return (
    <Box className={cn(styles.addDeck, className)}>
      <Flex spacing={{ p: 2 }} justifyContent="space-between" gap={2}>
        <TextInput
          placeholder={t('add_deck.find')}
          /** temporary until search logic is done */
          onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => {
            if (evt.code === 'Enter') {
              console.log('enter pressed');
            }
          }}
          hasClear
          size="m"
          className={styles.input}
          endContent={
            <Button view="flat" size="s" title={t('add_deck.input_title')}>
              <Icon data={Magnifier} />
            </Button>
          }
        />
        <Button onClick={onAddDeckClick} view="action">
          {t('add_deck.add')}
        </Button>
      </Flex>
    </Box>
  );
};
