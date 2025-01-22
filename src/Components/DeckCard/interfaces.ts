import { DeckFilled, DeckId } from '@/types/entry';

export interface DeckProps extends DeckFilled {
  onDelete: (deckId: DeckId) => void;
}
