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
import { getDecks, addDeck } from '@/transport/decks';

import { DeckData, DecksAndBoxes, DeckId } from '@/types/entry';
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

/** delete deck */
export const $isDeleteDeckPending = createStore(false);
export const deckDeleted = createEvent<DeckId>();

/** HELPERS */

const isAlphanumericOnly = (str: string) => /^[a-zA-Zа-яА-Я0-9\s]+$/.test(str);
