import { Box, DeckData, BoxStatus, DeckFilled } from '@/types/entry';

const DAY = 1000 * 60 * 60 * 24;

/**
 * 0: 0
 * 1: 1
 * 2: 2
 * 3: 3
 * 4: 5
 * 5: 7
 * 6: 10
 * 7: 15
 */
const timeMultyplier = [0, 1, 2, 3, 5, 7, 10, 15];

const checkStatus = (box: Box, currentTime: number): BoxStatus => {
  if (box.box === 0) {
    return 'waitinig';
  }

  if (
    box.box === 7 &&
    currentTime - box.lastStudied > timeMultyplier[box.box] * DAY
  ) {
    return 'learned';
  }

  return currentTime - box.lastStudied > timeMultyplier[box.box] * DAY
    ? 'waitinig'
    : 'mellowing';
};

const updateDeck = (deck: DeckFilled, status: BoxStatus) => {
  deck.entriesQuantity += 1;

  switch (status) {
    case 'learned':
      deck.entrieslearned += 1;
      break;
    case 'waitinig':
      deck.entriesToLearn += 1;
      break;
    case 'mellowing':
      deck.onMellowing += 1;
      break;
    default:
      return;
  }
};

export const fillDecksAndBoxes = (
  decks: DeckData[],
  boxes: Box[]
): DeckFilled[] => {
  const currentTime = Date.now();

  const filledDecks = decks.map<DeckFilled>((deck) => ({
    ...deck,
    entriesQuantity: 0,
    entriesToLearn: 0,
    onMellowing: 0,
    entrieslearned: 0,
    boxes: [],
  }));

  boxes.forEach((box) => {
    const updatedBox = {
      ...box,
      status: checkStatus(box, currentTime),
    };

    const deckToUpdate = filledDecks.find(
      (deck) => deck.deckId === updatedBox.deckId
    );

    if (deckToUpdate) {
      updateDeck(deckToUpdate, updatedBox.status);
      deckToUpdate.boxes?.push(updatedBox);
    }
  });

  return filledDecks;
};
