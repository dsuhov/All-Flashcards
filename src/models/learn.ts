import { sample, createStore, createEvent, createEffect } from 'effector';
import { createGate } from 'effector-react';

import { $filledDecks } from './decks';
import { $settings } from './settings';
import { $userData } from './auth';

import { showErrorFx } from './error';

import { getEntriesToLearn, updateLearnedBoxes } from '@/transport/learn';

import { BoxFilled, FilledEntry, Box } from '@/types/entry';

export const LearnGate = createGate<{ deckLinkName: string }>();
/** STORES */
export const $filledEntriesToLearn = createStore<FilledEntry[]>([]);
export const $isRedirectToMain = createStore<boolean>(false);
export const $entriesBlockToLearn = createStore<FilledEntry[]>([]);
export const $isUpdateLearnedBoxesPending = createStore(false);
export const $isExitComfirmOpen = createStore(false);
/** EVENTS */
export const pageRedirected = createEvent();

export const learnBlockCreated = createEvent();

export const entriesLearned = createEvent<Box[]>();

/** EFFECTS */
const getEntriesToLearnFx = createEffect<
  { filledBoxesToLearn: BoxFilled[]; userId: string | undefined },
  FilledEntry[],
  Error
>(async ({ filledBoxesToLearn, userId }) => {
  const entriesToLearn = await getEntriesToLearn({
    filledBoxesToLearn,
    userId,
  });

  const filledEntriesToLearn = entriesToLearn.map((entry) => {
    const currentBox = filledBoxesToLearn.find((box) => {
      return box.entryId === entry.entryId;
    })?.box;

    if (currentBox === undefined) {
      throw new Error('Current box not found');
    }

    return {
      ...entry,
      currentBox,
    } as FilledEntry;
  });

  return filledEntriesToLearn;
});

const updateLearnedBoxesFx = createEffect<
  { userId: string | undefined; learnedBoxes: Box[] },
  Box['boxId'][],
  Error
>(async ({ userId, learnedBoxes }) => {
  if (!userId) {
    throw new Error('User ID is undefined');
  }

  await updateLearnedBoxes({ userId, learnedBoxes });

  return learnedBoxes.map((box) => box.boxId);
});

/** LOGIC */

// when page is mounted, get entries to learn
sample({
  clock: LearnGate.open,
  source: {
    decksFilled: $filledDecks,
    userData: $userData,
  },
  fn: ({ decksFilled, userData }, { deckLinkName }) => {
    let filledBoxesToLearn: BoxFilled[] = [];
    const deck = decksFilled.find((deck) => deck.linkTitle === deckLinkName);

    if (!deck || !deck.boxes) {
      return {
        userId: userData?.userId,
        filledBoxesToLearn,
      };
    }

    filledBoxesToLearn = deck.boxes.filter((box) => box.status === 'waiting');

    return {
      userId: userData?.userId,
      filledBoxesToLearn,
    };
  },
  target: getEntriesToLearnFx,
});

// if error, show error
sample({
  clock: getEntriesToLearnFx.failData,
  fn: (clockData) => clockData.message,
  target: showErrorFx,
});

sample({
  clock: updateLearnedBoxesFx.failData,
  fn: (clockData) => clockData.message,
  target: showErrorFx,
});

// if no entries to learn, redirect to home page
sample({
  clock: getEntriesToLearnFx.doneData,
  filter: (filledEntries) => filledEntries.length === 0,
  target: pageRedirected,
});

// update filledEntriesToLearn store
$filledEntriesToLearn.on(
  getEntriesToLearnFx.doneData,
  (_, filledEntries) => filledEntries
);

$isRedirectToMain.on(pageRedirected, () => true);

$isRedirectToMain.reset(LearnGate.close);
$filledEntriesToLearn.reset(LearnGate.close);
$entriesBlockToLearn.reset(LearnGate.close);

$isExitComfirmOpen.on(learnBlockCreated, () => false);
// create learn block
sample({
  clock: getEntriesToLearnFx.done,
  target: learnBlockCreated,
});

sample({
  clock: learnBlockCreated,
  source: {
    settings: $settings,
    filledEntriesToLearn: $filledEntriesToLearn,
  },
  filter: ({ filledEntriesToLearn }) => filledEntriesToLearn.length > 0,
  fn: ({ settings, filledEntriesToLearn }) => {
    const entriesToLearnQunatity = settings.studySessionCards;

    return filledEntriesToLearn.slice(0, entriesToLearnQunatity);
  },
  target: $entriesBlockToLearn,
});

// pending if updateLearnedBoxesFx
sample({
  clock: updateLearnedBoxesFx.pending,
  target: $isUpdateLearnedBoxesPending,
});

// on entriesLearned start updateLearnedBoxesFx, update $filledEntriesToLearn
sample({
  clock: entriesLearned,
  source: $userData,
  fn: (userData, learnedBoxes) => ({
    userId: userData?.userId,
    learnedBoxes,
  }),
  target: updateLearnedBoxesFx,
});

$filledEntriesToLearn.on(
  updateLearnedBoxesFx.doneData,
  (filledEntries, learnedBoxes) =>
    filledEntries.filter(
      (entry) => !learnedBoxes.some((box) => box === entry.boxId)
    )
);

// open dialog
$isExitComfirmOpen.on(updateLearnedBoxesFx.done, () => true);
