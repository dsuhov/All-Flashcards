import { sample, createStore, createEffect } from 'effector';
import { createGate } from 'effector-react';
import { $userData } from '@/models/auth';

import { getEntries } from '@/transport/entries';
import { DeckId, BoxFilled, FilledEntry } from '@/types/entry';
import { showErrorFx, errorHasGottenEvt } from './error';
import { checkStatus } from '@/utils/fillDecksAndBoxes';

export type GetEntriesOpts = {
  deckLink: string | undefined;
  userId: string | undefined;
};

type EntriesData = {
  deckId: DeckId;
  boxes: BoxFilled[];
  entries: FilledEntry[];
};

export const EntriesGate = createGate<string | undefined>();

/** STORES */
export const $entriesData = createStore<EntriesData | null>(null);

export const $isEntriesPending = createStore(false);

/** EVENTS */

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
