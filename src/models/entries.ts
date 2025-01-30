import { sample, createStore, createEffect, createEvent } from 'effector';
import { createGate } from 'effector-react';
import { $userData } from '@/models/auth';

import { getEntries, updateEntry, removeEntry } from '@/transport/entries';
import {
  DeckId,
  EntryId,
  BoxFilled,
  FilledEntry,
  BoxNumber,
  BoxId,
} from '@/types/entry';
import { showErrorFx, errorHasGottenEvt } from './error';
import { checkStatus } from '@/utils/fillDecksAndBoxes';
import { UpdatableEntryContent } from '@/Components/EntryNew';

export type GetEntriesOpts = {
  deckLink: string | undefined;
  userId: string | undefined;
};

export type UpdateEntryOpts = {
  updatedEntryData: UpdatableEntryContent;
  newBox: {
    box: BoxNumber;
    lastStudied: number;
  } | null;
  userId: string | undefined;
};

export type UpdatedEntryData = {
  updatedEntryData: UpdatableEntryContent;
  newBox: {
    box: BoxNumber;
    lastStudied: number;
  } | null;
};

type EntriesData = {
  deckId: DeckId;
  boxes: BoxFilled[];
  entries: FilledEntry[];
};

export type RemoveEntryOpts = {
  boxId: BoxId;
  entryId: EntryId;
  userId: string | undefined;
};

export const EntriesGate = createGate<string | undefined>();

/** STORES */
export const $entriesData = createStore<EntriesData | null>(null);
export const $isEntriesPending = createStore(false);
export const $isUpdateEntryPending = createStore(false);

export const $editableEntryId = createStore<EntryId | null>(null);

export const entryEditClicked = createEvent<EntryId | null>();
$editableEntryId.on(entryEditClicked, (_, entryId) => entryId);

export const entryUpdated = createEvent<UpdatableEntryContent>();
export const entryDeleted = createEvent<EntryId>();

/** EFFECTS */
export const getEntriesFx = createEffect<GetEntriesOpts, EntriesData, Error>(
  async ({ deckLink, userId }) => {
    const { deck, boxes, entries } = await getEntries({ deckLink, userId });

    const currentTime = Date.now();
    const filledBoxes: BoxFilled[] = [];

    const filledEntries = entries.map((entry) => {
      const entryBox = boxes.find((box) => box.entryId === entry.entryId);

      if (!entryBox) {
        throw new Error('Entry box not found');
      }

      const boxStatus = checkStatus(entryBox, currentTime);

      filledBoxes.push({
        ...entryBox,
        status: boxStatus,
      });

      return {
        ...entry,
        currentBox: entryBox.box,
        isLearned: boxStatus === 'learned',
      };
    });

    return { deckId: deck.deckId, boxes: filledBoxes, entries: filledEntries };
  }
);

export const updateEntryFx = createEffect<
  UpdateEntryOpts,
  UpdatedEntryData,
  Error
>(async (args) => {
  const result = await updateEntry(args);

  return result;
});

export const removeEntryFx = createEffect<
  RemoveEntryOpts,
  { entryId: EntryId; boxId: BoxId },
  Error
>(async (opts) => {
  await removeEntry(opts);

  return { entryId: opts.entryId, boxId: opts.boxId };
});

/** LOGIC */
$entriesData.on(getEntriesFx.doneData, (_, data) => data);

sample({
  clock: EntriesGate.open,
  fn: (clockData) => {
    return {
      deckLink: clockData,
      userId: $userData.getState()?.userId,
    };
  },
  target: getEntriesFx,
});

sample({
  clock: getEntriesFx.pending,
  target: $isEntriesPending,
});

// error handling
sample({
  clock: getEntriesFx.failData,
  fn: (clockData) => clockData.message,
  target: errorHasGottenEvt,
});

sample({
  clock: errorHasGottenEvt,
  target: showErrorFx,
});

sample({
  clock: updateEntryFx.failData,
  fn: (clockData) => clockData.message,
  target: errorHasGottenEvt,
});

// update entry
sample({
  clock: entryUpdated,
  source: {
    userData: $userData,
    entryData: $entriesData,
  },
  fn: ({ userData, entryData }, clockData) => {
    const entry = entryData?.entries.find(
      (entry) => entry.entryId === clockData.entryId
    );
    const box = entryData?.boxes.find(
      (box) => box.entryId === clockData.entryId
    );

    if (!entry || !box) {
      throw new Error('Entry or box not found');
    }

    const { currentBox, ...restEntry } = clockData;

    const updatedEntry = {
      ...restEntry,
      boxId: entry.boxId,
    };

    return {
      userId: userData?.userId,
      updatedEntryData: updatedEntry,
      newBox:
        currentBox !== box.box
          ? { box: currentBox, lastStudied: Date.now() }
          : null,
    } as UpdateEntryOpts;
  },
  target: updateEntryFx,
});

$isUpdateEntryPending.on(
  [updateEntryFx.pending, removeEntryFx.pending],
  (_, pending) => pending
);
$editableEntryId.reset(updateEntryFx.done);
$entriesData.on(
  updateEntryFx.doneData,
  (state, { updatedEntryData, newBox }) => {
    if (!state) return state;

    const { entries, boxes } = state;

    const updatedEntries = entries.map((entry) =>
      entry.entryId === updatedEntryData.entryId
        ? {
            ...entry,
            ...updatedEntryData,
            currentBox: newBox?.box ?? entry.currentBox,
          }
        : entry
    );

    const updatedBoxes = boxes.map((box) =>
      box.entryId === updatedEntryData.entryId && newBox
        ? { ...box, box: newBox.box, lastStudied: newBox.lastStudied }
        : box
    );

    return newBox
      ? { ...state, entries: updatedEntries, boxes: updatedBoxes }
      : { ...state, entries: updatedEntries };
  }
);

// remove entry
sample({
  clock: entryDeleted,
  source: {
    userData: $userData,
    entryData: $entriesData,
  },
  fn: ({ userData, entryData }, clockData) => {
    const entry = entryData?.entries.find(
      (entry) => entry.entryId === clockData
    );

    if (!entry) {
      throw new Error('Entry not found');
    }

    return {
      boxId: entry.boxId,
      entryId: entry?.entryId,
      userId: userData?.userId,
    };
  },
  target: removeEntryFx,
});

$entriesData.on(removeEntryFx.doneData, (state, { entryId, boxId }) => {
  if (!state) return state;

  const { entries, boxes } = state;

  const updatedEntries = entries.filter((entry) => entry.entryId !== entryId);
  const updatedBoxes = boxes.filter((box) => box.boxId !== boxId);

  return { ...state, entries: updatedEntries, boxes: updatedBoxes };
});
