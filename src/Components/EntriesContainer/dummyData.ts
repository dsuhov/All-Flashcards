export const SINGLE_ENTRY_DATA = {
  deckId: 'deck-id-1',
  boxes: [
    {
      boxId: 'box-id-1',
      deckId: 'deck-id-1',
      entryId: 'entry-id-1',
      lastStudied: 0,
      box: 8,
      status: 'waiting',
    },
  ],
  entries: [
    {
      entryId: 'entry-id-1',
      boxId: 'box-id-1',
      deckId: 'deck-id-1',
      entryText: 'test entry 1',
      definitions: [
        { text: 'test definition 1', examples: ['test example 1'] },
      ],
      transcription: 'transcription 1',
      currentBox: 8,
    },
  ],
};
