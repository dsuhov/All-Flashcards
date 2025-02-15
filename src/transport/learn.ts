import {
  doc,
  getDocs,
  writeBatch,
  collection,
  query,
  where,
} from 'firebase/firestore';

import {
  USERS_COLLECTION,
  ENTRIES_COLLECTION,
  BOXES_COLLECTION,
} from '@/constants';

import { db } from '@/firebase.config';
import { BoxFilled, Entry, Box } from '@/types/entry';

const BATCH_SIZE = 10;

export const getEntriesToLearn = async ({
  filledBoxesToLearn,
  userId,
}: {
  filledBoxesToLearn: BoxFilled[];
  userId: string | undefined;
}): Promise<Entry[]> => {
  if (!userId) {
    throw new Error('User ID is undefined');
  }

  const results: unknown[] = [];

  const entriesCollectionRef = collection(
    db,
    USERS_COLLECTION,
    userId,
    ENTRIES_COLLECTION
  );

  for (let i = 0; i < filledBoxesToLearn.length; i += BATCH_SIZE) {
    const idsToGet = filledBoxesToLearn
      .slice(i, i + BATCH_SIZE)
      .map((box) => box.entryId);

    const entriesToLearnQuery = query(
      entriesCollectionRef,
      where('__name__', 'in', idsToGet)
    );

    const querySnapshot = await getDocs(entriesToLearnQuery);

    querySnapshot.forEach((doc) => {
      results.push({ entryId: doc.id, ...doc.data() });
    });
  }

  const entries = results.map((entry) => {
    return Entry.check(entry);
  });

  return entries;
};

export const updateLearnedBoxes = async ({
  userId,
  learnedBoxes,
}: {
  userId: string;
  learnedBoxes: Box[];
}) => {
  const batch = writeBatch(db);

  learnedBoxes.forEach((box) => {
    const { boxId, ...rest } = box;
    const boxRef = doc(db, USERS_COLLECTION, userId, BOXES_COLLECTION, boxId);

    batch.update(boxRef, rest);
  });

  await batch.commit();
};
