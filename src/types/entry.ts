import {
  String,
  Record,
  Static,
  Number,
  Array,
  Union,
  Literal,
} from 'runtypes';

export const BoxIdRT = String.withBrand('boxId');
export const DeckIdRT = String.withBrand('deckId');
export const EntryIdRT = String.withBrand('entryId');

export type BoxId = Static<typeof BoxIdRT>;
export type DeckId = Static<typeof DeckIdRT>;
export type EntryId = Static<typeof EntryIdRT>;

export const DeckDataRT = Record({
  deckId: DeckIdRT,
  title: String,
  linkTitle: String,
});

export const BoxNumber = Union(
  Literal(0),
  Literal(1),
  Literal(2),
  Literal(3),
  Literal(4),
  Literal(5),
  Literal(6),
  Literal(7),
  Literal(8)
);

export type BoxNumber = Static<typeof BoxNumber>;

export const BoxRT = Record({
  boxId: BoxIdRT,
  deckId: DeckIdRT,
  entryId: EntryIdRT,
  lastStudied: Number,
  box: BoxNumber,
});

export const BoxRTArray = Array(BoxRT);

export type Box = Static<typeof BoxRT>;

export type DecksAndBoxes = {
  decks: DeckData[];
  boxes: Box[];
};

export type BoxStatus = 'waiting' | 'mellowing' | 'learned';

export const BoxFilled = BoxRT.extend({
  status: Union(Literal('waiting'), Literal('mellowing'), Literal('learned')),
});

export type BoxFilled = Static<typeof BoxFilled>;

export const DeckDataArrayRT = Array(DeckDataRT);

export type DeckData = Static<typeof DeckDataRT>;

export interface DeckFilled extends DeckData {
  entriesQuantity: number;
  entriesToLearn: number;
  onMellowing: number;
  entrieslearned: number;
  boxes?: BoxFilled[];
}

export type DecksAndBoxesFilled = {
  decks: DeckFilled[];
  boxes: BoxFilled[];
};

export const Definition = Record({
  text: String,
  examples: Array(String).optional(),
});

export const Entry = Record({
  entryId: EntryIdRT,
  boxId: BoxIdRT,
  deckId: DeckIdRT,
  entryText: String,
  definitions: Array(Definition).optional(),
  transcription: String.optional(),
});

export const FilledEntry = Entry.extend({
  currentBox: BoxNumber,
});

export type FilledEntry = Static<typeof FilledEntry>;

export interface Definition {
  text: string;
  examples?: string[];
}

export type Entry = Static<typeof Entry>;
