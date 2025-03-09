import { sample, createStore, createEffect, createEvent } from 'effector';
import { createGate } from 'effector-react';
import { $userData } from '@/models/auth';

import {
  getEntries,
  updateEntry,
  removeEntry,
  addNewEntry,
} from '@/transport/entries';
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
import {
  UpdatableEntryContent,
  NewEntryContent,
} from '@/Components/widgets/EntryNew';

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
export const $filteredEntriesData = createStore<EntriesData | null>(null);

export const $isEntriesPending = createStore(false);
export const $isUpdateEntryPending = createStore(false);

export const $editableEntryId = createStore<EntryId | null>(null);

export const entryEditClicked = createEvent<EntryId | null>();
$editableEntryId.on(entryEditClicked, (_, entryId) => entryId);

export const entryUpdated = createEvent<UpdatableEntryContent>();
export const entryDeleted = createEvent<EntryId>();
export const entriesSorted = createEvent<string>();

$filteredEntriesData.on(entriesSorted, (_, payload) => {
  const entriesData = $entriesData.getState();

  if (!entriesData || payload === '') {
    return null;
  }

  const filteredEntries = entriesData.entries.filter((entry) =>
    entry.entryText.includes(payload)
  );

  return {
    ...entriesData,
    entries: filteredEntries,
  };
});

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
        status: boxStatus as BoxFilled['status'],
      });

      return {
        ...entry,
        currentBox: entryBox.box,
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
$editableEntryId.on(EntriesGate.close, () => null);

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

// add new entry
export type AddNewEntryOpts = {
  deckId: DeckId;
  userId: string | undefined;
  newEntries: NewEntryContent[];
};

type NewAddedEntryData = {
  box: BoxFilled[];
  entry: FilledEntry[];
};

export const $isAddingNewEntry = createStore(false);
export const $addEntryPending = createStore(false);

export const entryAdded = createEvent<NewEntryContent[] | null>();
export const entryAddStarted = createEvent<boolean>();

$isAddingNewEntry.on(entryAddStarted, (_, isStarted) => isStarted);

export const entryAddedFx = createEffect<
  AddNewEntryOpts,
  NewAddedEntryData,
  Error
>(async (opts) => {
  const { entry, box } = await addNewEntry(opts);

  const newEntries = entry.map((e, idx) =>
    FilledEntry.check({
      ...e,
      currentBox: BoxNumber.check(box[idx].box),
    })
  );

  const newBoxes = box.map((b) =>
    BoxFilled.check({
      ...b,
      status: 'waiting',
    })
  );

  return { entry: newEntries, box: newBoxes };
});

$addEntryPending.on(entryAddedFx.pending, (_, pending) => pending);

sample({
  clock: entryAdded,
  source: {
    userData: $userData,
    entriesData: $entriesData,
  },
  filter: (sources, clock) => {
    return Boolean(
      sources.userData?.userId &&
        sources.entriesData?.deckId &&
        Array.isArray(clock) &&
        clock.length > 0
    );
  },
  fn: ({ userData, entriesData }, newEntries) => ({
    deckId: entriesData!.deckId,
    userId: userData!.userId,
    newEntries: newEntries!,
  }),
  target: entryAddedFx,
});

$entriesData.on(entryAddedFx.doneData, (state, { entry, box }) => {
  if (!state) return state;

  return {
    ...state,
    entries: [...state.entries, ...entry],
    boxes: [...state.boxes, ...box],
  };
});

$isAddingNewEntry.on(entryAddedFx.finally, () => false);

$isAddingNewEntry.reset(EntriesGate.close);
$filteredEntriesData.reset(EntriesGate.close);

sample({
  clock: entryAddedFx.failData,
  fn: (clockData) => clockData.message,
  target: errorHasGottenEvt,
});
