import { Flex, Box, Loader } from '@gravity-ui/uikit';
import { useUnit, useGate } from 'effector-react';

import { DeckCard } from '@/Components/DeckCard';
import { AddDeck } from '@/Components/AddDeck';

import {
  DecksGate,
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
} from '@/models/decks';

import styles from './styles.module.css';

export const DecksContainer = () => {
  useGate(DecksGate);

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
  ]);

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
        onDelete={(deckId) => console.log('delete ', deckId)}
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
      <Flex direction="column" gap={2} spacing={{ mt: 2 }}>
        {decks}
        {!decks && loadingDecks && (
          <Flex justifyContent="center">
            <Loader size="m" />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
