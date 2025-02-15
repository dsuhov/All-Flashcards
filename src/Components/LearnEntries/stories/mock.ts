import { FilledEntry, EntryId, BoxId, DeckId } from '@/types/entry';

export const mockEntries: FilledEntry[] = [
  {
    entryId: '1' as EntryId,
    boxId: '1' as BoxId,
    deckId: '1' as DeckId,
    entryText: 'hiatus',
    currentBox: 1,
    definitions: [
      {
        text: `<p class="short" style="box-sizing: border-box; margin: 0px 0px 10px; line-height: normal; font-size: 18px; color: rgb(51, 51, 51); font-family: &quot;open sans&quot;, arial, helvetica, sans-serif; background-color: rgb(255, 255, 255);">A temporary gap, pause, break, or absence can be called a&nbsp;<i style="box-sizing: border-box;">hiatus</i>. When your favorite TV show is on&nbsp;<i style="box-sizing: border-box;">hiatus</i>, that means there are no new episodes — not forever, just for a little while.</p><p class="long" style="box-sizing: border-box; margin: 0px 0px 1em; line-height: normal; font-size: 14px; color: rgb(51, 51, 51); font-family: &quot;open sans&quot;, arial, helvetica, sans-serif; background-color: rgb(255, 255, 255);">Even things that go on for a long time take a break once in a while: one kind of break is a hiatus. If someone has to leave her job for a time, she's going on hiatus. A touring band will need to take a hiatus if the lead singer gets in an accident. The key thing about a hiatus is that it's an interruption of something that was happening, but it's not a permanent break.</p>`,
        examples: [
          'After their three-week hiatus, the young players borrowed an old automobile from the editor of the California Chess Reporter, Guthrie McClain.',
          'The detailed reasons for the hiatus are outside the scope of this book.\nThe Scientists by John Gribbin',
        ],
      },
      {
        text: `a natural opening or perforation through a <i>bone or a membranous structure</i>`,
      },
      {
        text: `a missing piece (as a gap in a manuscript)`,
      },
    ],
    transcription: 'haɪˈeɪdəs',
  },
  {
    entryId: '2' as EntryId,
    boxId: '2' as BoxId,
    deckId: '2' as DeckId,
    entryText: 'neglect',
    currentBox: 0,
    definitions: [
      {
        text: `Neglect is worse than ignoring something. It's ignoring it, failing to care for it, and probably harming it in the process.`,
        examples: [
          'She’d been neglecting her hair, which was darker and straighter; her body had grown stubby, her face round.',
        ],
      },
    ],
    transcription: 'nəˈglɛkt',
  },
  {
    entryId: '3' as EntryId,
    boxId: '3' as BoxId,
    deckId: '3' as DeckId,
    entryText: 'chore',
    currentBox: 7,
    definitions: [
      {
        text: `a specific piece of work required to be done as a duty or for a specific fee`,
      },
    ],
  },
  {
    entryId: '4' as EntryId,
    boxId: '4' as BoxId,
    deckId: '4' as DeckId,
    entryText:
      'Grandpa Smedry proceeded to turn the wheel back and forth, seeming in random directions, as a child might play with a toy steering wheel.',
    currentBox: 2,
  },
];
