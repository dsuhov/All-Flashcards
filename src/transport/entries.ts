import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from 'firebase/firestore';

import {
  USERS_COLLECTION,
  ENTRIES_COLLECTION,
  BOXES_COLLECTION,
  DECKS_COLLECTION,
} from '@/constants';

import { Box, BoxRT, Entry, DeckDataRT, DeckData } from '@/types/entry';
import { db } from '@/firebase.config';
import {
  GetEntriesOpts,
  UpdateEntryOpts,
  UpdatedEntryData,
  RemoveEntryOpts,
} from '@/models/entries';

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

export const updateEntry = async ({
  updatedEntryData,
  newBox,
  userId,
}: UpdateEntryOpts): Promise<UpdatedEntryData> => {
  const batch = writeBatch(db);

  if (!userId) {
    throw new Error('userId is undefined');
  }

  const entryRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    ENTRIES_COLLECTION,
    updatedEntryData.entryId
  );
  const boxRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    BOXES_COLLECTION,
    updatedEntryData.boxId
  );

  batch.update(entryRef, updatedEntryData);

  if (newBox) {
    batch.update(boxRef, newBox);
  }

  await batch.commit();

  return {
    updatedEntryData,
    newBox: newBox ? newBox : null,
  };
};

export const removeEntry = async ({
  boxId,
  entryId,
  userId,
}: RemoveEntryOpts) => {
  if (!userId) {
    throw new Error('userId is undefined');
  }

  const batch = writeBatch(db);

  const entryRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    ENTRIES_COLLECTION,
    entryId
  );

  const boxRef = doc(db, USERS_COLLECTION, userId, BOXES_COLLECTION, boxId);

  batch.delete(entryRef);
  batch.delete(boxRef);

  await batch.commit();

  return { entryId, boxId };
};
