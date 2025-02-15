import {
  sample,
  createStore,
  createEvent,
  createEffect,
  combine,
} from 'effector';

import { createGate } from 'effector-react';
import slug from 'slug';

import { $userData } from './auth';
import { showErrorFx } from './error';
import { getDecks, addDeck, removeDeck } from '@/transport/decks';

import { DeckData, DecksAndBoxes, DeckId, DeckFilled } from '@/types/entry';
import { fillDecksAndBoxes } from '@/utils/fillDecksAndBoxes';

export const DecksGate = createGate();

/** STORES */
export const $decksAndBoxes = createStore<DecksAndBoxes>({
  decks: [],
  boxes: [],
});

export const $loadingDecks = createStore(false);

export const $isDeckNameOpen = createStore(false);
export const $deckNameValue = createStore('');

export const $isDeckNamePending = createStore(false);
export const $deckNameError = createStore('');

/** EVENTS */
export const deckNameClosed = createEvent();
export const deckNameBtnClicked = createEvent();
export const deckNameInputChanged = createEvent<string>();
export const deckNameInputSaved = createEvent();

// derived stores
export const $filledDecks = $decksAndBoxes.map((state) =>
  fillDecksAndBoxes(state.decks, state.boxes)
);

/** EFFECTS */

export const getDecksFx = createEffect<string, DecksAndBoxes, Error>(
  (userId) => {
    return getDecks(userId);
  }
);

export const addDeckFx = createEffect<
  { userId: string; newDeckName: string },
  DeckData,
  Error
>(({ userId, newDeckName }) => {
  return addDeck(userId, newDeckName, slug(newDeckName));
});

/** LOGIC */

/** load Decks on mount */

sample({
  clock: DecksGate.open,
  source: $userData.map((d) => (d ? d.userId : null)),
  filter: (sourceData) => sourceData !== null,
  target: getDecksFx,
});

sample({
  clock: getDecksFx.pending,
  target: $loadingDecks,
});

$loadingDecks.on(getDecksFx.pending, (_, pending) => pending);

sample({
  clock: getDecksFx.failData,
  fn: (clockData) => clockData.message,
  target: showErrorFx,
});

$decksAndBoxes.on(getDecksFx.doneData, (_, { decks, boxes }) => {
  return {
    decks,
    boxes,
  };
});

/** add deck */
$isDeckNameOpen.on(deckNameBtnClicked, () => true);
$isDeckNameOpen.on(deckNameClosed, () => false);
$deckNameValue.on(deckNameInputChanged, (_, v) => v);

$deckNameValue.reset(deckNameClosed);
$deckNameError.reset([deckNameClosed, deckNameBtnClicked]);

sample({
  clock: deckNameInputSaved,
  source: $deckNameValue,
  fn: (newDeckName) => {
    if (!isAlphanumericOnly(newDeckName)) {
      return 'Название набора может содержать только русские или латинские буквы и цифры';
    }

    return '';
  },
  target: $deckNameError,
});

sample({
  clock: deckNameInputSaved,
  source: combine(
    $userData.map((d) => (d ? d.userId : '')),
    $deckNameValue,
    (userId, newDeckName) => ({ userId, newDeckName })
  ),
  filter: () => !($deckNameError.getState().length > 0),
  target: addDeckFx,
});

sample({
  clock: addDeckFx.pending,
  target: $isDeckNamePending,
});

sample({
  clock: addDeckFx.done,
  target: deckNameClosed,
});

$decksAndBoxes.on(addDeckFx.doneData, (old, newDeck) => {
  if (old) {
    return {
      decks: [...old.decks, newDeck],
      boxes: old.boxes,
    };
  }

  return old;
});

sample({
  clock: addDeckFx.failData,
  fn: (clockData) => clockData.message,
  target: showErrorFx,
});

/** HELPERS */

const isAlphanumericOnly = (str: string) => /^[a-zA-Zа-яА-Я0-9\s]+$/.test(str);

/** delete deck */
export type DeckDeleteOpts = {
  userId: string | undefined;
  deckFilled: DeckFilled;
};

const $deckToDelete = createStore<DeckFilled | null>(null);
export const $deckToDeleteDisplay = createStore<{
  deckTitle: string;
  entriesCount: number | undefined;
} | null>(null);

sample({
  clock: $deckToDelete,
  filter: (deckToDelete) => !!deckToDelete,
  fn: (deckToDelete) => {
    return {
      deckTitle: deckToDelete!.title,
      entriesCount: deckToDelete!.boxes?.length,
    };
  },
  target: $deckToDeleteDisplay,
});

export const $confirmDeletionOpen = createStore(false);
export const $isDeleteDeckPending = createStore(false);

export const deckDeletionStarted = createEvent<DeckId>();

export const deckDeletionConfirmed = createEvent();
export const deckDeletionCancelled = createEvent();
export const displayMessageCleaned = createEvent();

$deckToDeleteDisplay.on(displayMessageCleaned, () => null);

const getDeckToDeleteFx = createEffect<
  { deckId: DeckId; decksFilled: DeckFilled[] },
  DeckFilled,
  Error
>(({ deckId, decksFilled }) => {
  const deckToDelete = decksFilled.find(
    (deckFilled) => deckFilled.deckId === deckId
  );

  if (!deckToDelete) {
    throw new Error('getDeckToDeleteFx error: deck ${deckId} not found');
  }

  return deckToDelete;
});

sample({
  clock: deckDeletionStarted,
  source: $filledDecks,
  fn: (decksFilled, deckId) => ({
    deckId,
    decksFilled,
  }),
  target: getDeckToDeleteFx,
});

sample({
  clock: getDeckToDeleteFx.failData,
  fn: (clockData) => clockData.message,
  target: showErrorFx,
});

$confirmDeletionOpen.on(getDeckToDeleteFx.done, () => true);
$confirmDeletionOpen.on(deckDeletionCancelled, () => false);

export const deleteDeckFx = createEffect<DeckDeleteOpts, DeckId, Error>(
  async (opts) => {
    const deletedDeckId = await removeDeck(opts);

    return deletedDeckId;
  }
);

$confirmDeletionOpen.on(deleteDeckFx.finally, () => false);

sample({
  clock: deleteDeckFx.failData,
  fn: (clockData) => clockData.message,
  target: showErrorFx,
});

$deckToDelete
  .on(getDeckToDeleteFx.doneData, (_, data) => data)
  .on(getDeckToDeleteFx.fail, () => null)
  .on(DecksGate.close, () => null)
  .on(deckDeletionCancelled, () => null)
  .on(deleteDeckFx.done, () => null);

sample({
  clock: deckDeletionConfirmed,
  source: {
    userData: $userData,
    deckFilled: $deckToDelete,
  },
  fn: ({ userData, deckFilled }) => ({
    userId: userData?.userId,
    deckFilled: deckFilled as DeckFilled,
  }),
  target: deleteDeckFx,
});

$isDeleteDeckPending.on(deleteDeckFx.pending, (_, pending) => pending);

$decksAndBoxes.on(deleteDeckFx.doneData, (state, data) => ({
  decks: state.decks.filter((deck) => deck.deckId !== data),
  boxes: state.boxes.filter((box) => box.deckId !== data),
}));
