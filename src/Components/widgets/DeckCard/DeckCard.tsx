import { MouseEvent } from 'react';
import { Card, Icon, Flex, Text, Button, Label } from '@gravity-ui/uikit';
import { TrashBin } from '@gravity-ui/icons';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { LEARN_ROUTE, DECKS_ROUTE } from '@/constants';
import { DEFAULT_TEST_ID } from './constants';
import { DeckProps } from './interfaces';

export const DeckCard = (props: DeckProps) => {
  const {
    deckId,
    title,
    linkTitle,
    entriesQuantity,
    entriesToLearn,
    onMellowing,
    entrieslearned,
    onDelete,
  } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const onCardClickHandler = (evt: MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();

    navigate(`${DECKS_ROUTE}/${linkTitle}`);
  };

  const onLearnClickHandler = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();

    navigate(`${DECKS_ROUTE}/${linkTitle}/${LEARN_ROUTE}`);
  };

  const onDeletehandler = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    onDelete(deckId);
  };

  return (
    <Card
      role="link"
      data-href={`${DECKS_ROUTE}/${linkTitle}`}
      spacing={{ p: 2 }}
      tabIndex={0}
      type="action"
      onClick={onCardClickHandler}
      data-testid={DEFAULT_TEST_ID}
    >
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between">
          <Text variant="header-1">{title}</Text>
          <Button
            view="flat"
            size="s"
            title={t('deck.remove')}
            onClick={onDeletehandler}
          >
            <Icon data={TrashBin} />
          </Button>
        </Flex>

        <Flex justifyContent="space-between">
          <Flex gap={1} wrap>
            <Label size="s">{`${t('deck.entriesQuantity')}: ${entriesQuantity}`}</Label>
            {onMellowing > 0 && (
              <Label theme="warning" size="s">
                {`${t('deck.onMellowing')}: ${onMellowing}`}
              </Label>
            )}
            {entrieslearned > 0 && (
              <Label theme="success" size="s">
                {`${t('deck.entrieslearned')}: ${entrieslearned}`}
              </Label>
            )}
          </Flex>
          {entriesToLearn > 0 && (
            <Button
              view="outlined-danger"
              size="s"
              title={t('deck.toLearn')}
              onClick={onLearnClickHandler}
              href={`${DECKS_ROUTE}/${linkTitle}/${LEARN_ROUTE}`}
            >
              {`${t('deck.toLearn')}: ${entriesToLearn}`}
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
