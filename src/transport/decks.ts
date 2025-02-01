import {
  collection,
  getDocs,
  addDoc,
  writeBatch,
  doc,
} from 'firebase/firestore';

import {
  USERS_COLLECTION,
  DECKS_COLLECTION,
  BOXES_COLLECTION,
  ENTRIES_COLLECTION,
} from '@/constants';

import { db } from '@/firebase.config';
import { DeckDataArrayRT, DeckDataRT, BoxRTArray } from '@/types/entry';
import { DeckDeleteOpts } from '@/models/decks';

export const getDecks = async (userId: string) => {
  const decksData: unknown[] = [];
  const boxesData: unknown[] = [];

  const decksDataSnapshot = await getDocs(
    collection(db, USERS_COLLECTION, userId, DECKS_COLLECTION)
  );
  const boxesDataSnapshot = await getDocs(
    collection(db, USERS_COLLECTION, userId, BOXES_COLLECTION)
  );

  decksDataSnapshot.forEach((doc) =>
    decksData.push({
      deckId: doc.id,
      ...doc.data(),
    })
  );

  boxesDataSnapshot.forEach((doc) =>
    boxesData.push({
      boxId: doc.id,
      ...doc.data(),
    })
  );

  return {
    decks: DeckDataArrayRT.check(decksData),
    boxes: BoxRTArray.check(boxesData),
  };
};

export const addDeck = async (
  userId: string,
  newDeckName: string,
  linkName: string
) => {
  const newDeckDocRef = await addDoc(
    collection(db, USERS_COLLECTION, userId, DECKS_COLLECTION),
    {
      title: newDeckName,
      linkTitle: linkName,
    }
  );

  return DeckDataRT.check({
    deckId: newDeckDocRef.id,
    title: newDeckName,
    linkTitle: linkName,
  });
};

export const removeDeck = async ({ userId, deckFilled }: DeckDeleteOpts) => {
  if (!userId) {
    throw new Error('removeDeck: userId is not defined');
  }

  const batch = writeBatch(db);

  deckFilled.boxes?.forEach((box) => {
    const boxRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      BOXES_COLLECTION,
      box.boxId
    );
    const entryRef = doc(
      db,
      USERS_COLLECTION,
      userId,
      ENTRIES_COLLECTION,
      box.entryId
    );

    batch.delete(boxRef);
    batch.delete(entryRef);
  });

  const deckRef = doc(
    db,
    USERS_COLLECTION,
    userId,
    DECKS_COLLECTION,
    deckFilled.deckId
  );
  batch.delete(deckRef);

  await batch.commit();

  return deckFilled.deckId;
};
