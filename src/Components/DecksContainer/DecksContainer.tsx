import { Flex, Box, Loader, Dialog, Text } from '@gravity-ui/uikit';
import { useUnit, useGate } from 'effector-react';
import { useTranslation } from 'react-i18next';

import { DecksGate } from '@/models/decks';
import { DeckCard } from '@/Components/DeckCard';
import { AddDeck } from '@/Components/AddDeck';

import {
  $filledDecks,
  $loadingDecks,
  $isDeckNameOpen,
  $deckNameValue,
  $deckNameError,
  $isDeckNamePending,
  deckNameClosed,
  deckNameBtnClicked,
  deckNameInputChanged,
  deckNameInputSaved,
  $confirmDeletionOpen,
  $isDeleteDeckPending,
  $deckToDeleteDisplay,
  deckDeletionStarted,
  deckDeletionConfirmed,
  deckDeletionCancelled,
  displayMessageCleaned,
} from '@/models/decks';

import styles from './styles.module.css';

export const DecksContainer = () => {
  const { t } = useTranslation();

  const [
    filledDecks,
    loadingDecks,
    isDeckNameOpen,
    deckNameValue,
    deckNameError,
    isDeckNamePending,

    deckNameClosedEvt,
    deckNameBtnClickedEvt,
    onDeckNameInputChange,
    onDeckNameInputSave,

    confirmDeletionOpen,
    isDeleteDeckPending,
    deckToDeleteDisplay,

    deckDeletionStartedEvt,
    deckDeletionConfirmedEvt,
    deckDeletionCancelledEvt,
    displayMessageCleanedEvt,
  ] = useUnit([
    $filledDecks,
    $loadingDecks,
    $isDeckNameOpen,
    $deckNameValue,
    $deckNameError,
    $isDeckNamePending,

    deckNameClosed,
    deckNameBtnClicked,
    deckNameInputChanged,
    deckNameInputSaved,

    $confirmDeletionOpen,
    $isDeleteDeckPending,
    $deckToDeleteDisplay,

    deckDeletionStarted,
    deckDeletionConfirmed,
    deckDeletionCancelled,
    displayMessageCleaned,
  ]);

  useGate(DecksGate);

  const decks = filledDecks
    .sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    })
    .map((decksData) => (
      <DeckCard
        deckId={decksData.deckId}
        title={decksData.title}
        linkTitle={decksData.linkTitle}
        entriesQuantity={decksData.entriesQuantity}
        entriesToLearn={decksData.entriesToLearn}
        onMellowing={decksData.onMellowing}
        entrieslearned={decksData.entrieslearned}
        key={decksData.deckId}
        onDelete={(deckId) => deckDeletionStartedEvt(deckId)}
      />
    ));

  return (
    <Box>
      <AddDeck
        onAddDeckClick={deckNameBtnClickedEvt}
        closePopup={deckNameClosedEvt}
        className={styles.addDeckBar}
        inputFieldOpen={isDeckNameOpen}
        onDeckNameInputChange={(evt) => onDeckNameInputChange(evt.target.value)}
        deckNameNameValue={deckNameValue}
        onSave={onDeckNameInputSave}
        error={deckNameError}
        pending={isDeckNamePending}
      />
      <Flex direction="column" gap={2} spacing={{ mt: 2, pb: 2 }}>
        {decks}
        {loadingDecks && !decks.length && (
          <Flex justifyContent="center">
            <Loader size="m" />
          </Flex>
        )}
      </Flex>
      <Dialog
        onTransitionExited={displayMessageCleanedEvt}
        onClose={deckDeletionCancelledEvt}
        open={confirmDeletionOpen}
        onEnterKeyDown={deckDeletionConfirmedEvt}
      >
        <Dialog.Header caption={t('deck.remove')} />
        <Dialog.Body>
          <Flex direction="column">
            <Text variant="body-2">
              {t('deck.areYouSure')}{' '}
              <Text color="danger" variant="body-3">
                {deckToDeleteDisplay?.deckTitle}
              </Text>
              ?
            </Text>
            <Text>
              {t('deck.wordsToRemove')} {deckToDeleteDisplay?.entriesCount}
            </Text>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer
          loading={isDeleteDeckPending}
          onClickButtonCancel={deckDeletionCancelledEvt}
          onClickButtonApply={deckDeletionConfirmedEvt}
          textButtonApply={t('deck.remove')}
          textButtonCancel={t('common.cancel')}
        />
      </Dialog>
    </Box>
  );
};
