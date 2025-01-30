import { collection, query, where, getDocs } from 'firebase/firestore';

import {
  USERS_COLLECTION,
  ENTRIES_COLLECTION,
  BOXES_COLLECTION,
  DECKS_COLLECTION,
} from '@/constants';

import { db } from '@/firebase.config';
import { Entry, DeckDataRT, DeckData, Box, BoxRT } from '@/types/entry';
import { GetEntriesOpts } from '@/models/entries';

export const getEntries = async ({ deckLink, userId }: GetEntriesOpts) => {
  if (!userId || !deckLink) {
    throw new Error('userId or deckId is undefined');
  }

  const decks: DeckData[] = [];
  const boxes: Box[] = [];
  const entries: Entry[] = [];

  const boxesRef = collection(db, USERS_COLLECTION, userId, BOXES_COLLECTION);

  const decksRef = collection(db, USERS_COLLECTION, userId, DECKS_COLLECTION);

  const entriesRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    ENTRIES_COLLECTION
  );

  const deckQuery = query(decksRef, where('linkTitle', '==', deckLink));
  const deckQuerySnapshot = await getDocs(deckQuery);
  deckQuerySnapshot.forEach((doc) => {
    decks.push(
      DeckDataRT.check({
        ...doc.data(),
        deckId: doc.id,
      })
    );
  });

  const boxesQuery = query(boxesRef, where('deckId', '==', decks[0].deckId));
  const boxesQuerySnapshot = await getDocs(boxesQuery);
  boxesQuerySnapshot.forEach((doc) => {
    boxes.push(
      BoxRT.check({
        ...doc.data(),
        boxId: doc.id,
      })
    );
  });

  const entriesQuery = query(
    entriesRef,
    where('deckid', '==', decks[0].deckId)
  );
  const entriesQuerySnapshot = await getDocs(entriesQuery);
  entriesQuerySnapshot.forEach((doc) => {
    entries.push(
      Entry.check({
        ...doc.data(),
        entryId: doc.id,
      })
    );
  });

  return { deck: decks[0], boxes, entries };
};
