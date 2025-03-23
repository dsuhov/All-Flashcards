import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@gravity-ui/uikit';
import { fork, Scope } from 'effector';
import { Provider } from 'effector-react';

import {
  getEntriesFx,
  updateEntryFx,
  entryAddedFx,
  removeEntryFx,
  AddNewEntryOpts,
  UpdateEntryOpts,
  RemoveEntryOpts,
} from '@/models/entries';
import { $userData } from '@/models/auth';
import { userEvent } from '@testing-library/user-event';
import '@/i18n/i18n.config';
import { EntriesContainer } from '../EntriesContainer';

import { SINGLE_ENTRY_DATA } from '../dummyData';
import { translations } from '@/i18n/translations';

jest.mock('@/firebase.config.ts', () => {
  return {};
});

describe('EntriesPage tests', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;

  const Component = ({ scope }: { scope: Scope }) => (
    <ThemeProvider>
      <Provider value={scope}>
        <EntriesContainer />
      </Provider>
    </ThemeProvider>
  );

  it('renders component without entries', async () => {
    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [
        [
          getEntriesFx,
          () => ({
            deckId: SINGLE_ENTRY_DATA.deckId,
            boxes: [],
            entries: [],
          }),
        ],
      ],
    });

    render(<Component scope={scope} />);

    expect(
      screen.queryByText(SINGLE_ENTRY_DATA.entries[0].entryText)
    ).not.toBeInTheDocument();
  });

  it('renders entry card', async () => {
    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [[getEntriesFx, () => SINGLE_ENTRY_DATA]],
    });

    render(<Component scope={scope} />);

    expect(
      await screen.findByText(SINGLE_ENTRY_DATA.entries[0].entryText)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(`[${SINGLE_ENTRY_DATA.entries[0].transcription}]`)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(SINGLE_ENTRY_DATA.entries[0].definitions[0].text)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        SINGLE_ENTRY_DATA.entries[0].definitions[0].examples[0]
      )
    ).toBeInTheDocument();
  });

  it('click on add button creates entry form', async () => {
    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [
        [
          getEntriesFx,
          () => ({
            deckId: SINGLE_ENTRY_DATA.deckId,
            boxes: [],
            entries: [],
          }),
        ],
      ],
    });

    render(<Component scope={scope} />);

    const addBtn = await screen.findByTitle(
      translations.rus.translation['entryNew.add']
    );

    await userEvent.click(addBtn);

    expect(
      await screen.findByPlaceholderText(
        translations.rus.translation['entryNew.entryText']
      )
    ).toBeInTheDocument();
  });

  it('fill entry form and create entry, entry card rendered', async () => {
    const TEST_ENTRY_CONTENT = [
      {
        entryText: 'test entry text',
        transcription: 'test transcription',
        examples: 'test example',
        definitions: 'test definition',
      },
    ];
    const ENTRY_FILEDS = [
      translations.rus.translation['entryNew.entryText'],
      translations.rus.translation['entryNew.transcription'],
      translations.rus.translation['entryNew.example'],
      translations.rus.translation['entryNew.definition'],
    ];

    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [
        [
          getEntriesFx,
          () => ({
            deckId: SINGLE_ENTRY_DATA.deckId,
            boxes: [],
            entries: [],
          }),
        ],
        [
          entryAddedFx,
          ({ deckId, newEntries }: AddNewEntryOpts) => ({
            entry: [
              {
                ...newEntries[0],
                entryId: 'entry-id-1',
                deckId: deckId,
                boxId: 'box-id-1',
                currentBox: 1,
              },
            ],
            box: [
              {
                boxId: 'box-id-1',
                entryId: 'entry-id-1',
                deckId: deckId,
                box: 1,
                lastStudied: 0,
                status: 'waiting',
              },
            ],
          }),
        ],
      ],
    });

    render(<Component scope={scope} />);

    const addBtn = await screen.findByTitle(
      translations.rus.translation['entryNew.add']
    );

    await userEvent.click(addBtn);

    const fieldElements = await Promise.all(
      ENTRY_FILEDS.map(
        async (field) => await screen.findByPlaceholderText(field)
      )
    );

    for (let i = 0; i < fieldElements.length; i++) {
      await userEvent.type(
        fieldElements[i],
        Object.values(TEST_ENTRY_CONTENT[0])[i]
      );
    }

    const saveBtn = await screen.findByTitle(
      translations.rus.translation['common.save']
    );

    await userEvent.click(saveBtn);

    const entries = Object.values(TEST_ENTRY_CONTENT[0]);
    for (const entry of entries) {
      const data = await screen.findByText(new RegExp(entry));
      expect(data).toBeInTheDocument();
    }
  });

  it('edit entry', async () => {
    window.Date.now = () => 0;
    const newBox = 5;
    const newEntryText = 'new entry text';

    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [
        [getEntriesFx, () => SINGLE_ENTRY_DATA],
        [
          updateEntryFx,
          ({ updatedEntryData, newBox }: UpdateEntryOpts) => {
            return {
              updatedEntryData: {
                ...updatedEntryData,
                currentBox: newBox?.box,
              },
              newBox,
            };
          },
        ],
      ],
    });

    render(<Component scope={scope} />);

    const editBtn = await screen.findByTitle(
      translations.rus.translation['entryCard.edit']
    );

    await userEvent.click(editBtn);

    const boxBtn = await screen.findByText(
      translations.rus.translation['entryEditable.box']
    );
    const entryTitle = await screen.findByPlaceholderText(
      translations.rus.translation['entryNew.entryText']
    );

    await userEvent.click(boxBtn);
    await userEvent.click(await screen.findByText(newBox.toString()));
    await userEvent.clear(entryTitle);
    await userEvent.type(entryTitle, newEntryText);

    const saveBtn = await screen.findByTitle(
      translations.rus.translation['common.save']
    );

    await userEvent.click(saveBtn);

    expect(await screen.findByText(newEntryText)).toBeInTheDocument();
    expect(await screen.findByText(newBox.toString())).toBeInTheDocument();
  });

  it('on delete entry opens dialog', async () => {
    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [
        [getEntriesFx, () => SINGLE_ENTRY_DATA],
        [
          removeEntryFx,
          ({ entryId, boxId }: RemoveEntryOpts) => ({ entryId, boxId }),
        ],
      ],
    });

    render(<Component scope={scope} />);

    const deleteBtn = await screen.findByTitle(
      translations.rus.translation['entryCard.remove']
    );

    await userEvent.click(deleteBtn);

    expect(await screen.findByText(/Удалить запись/)).toBeInTheDocument();
  });

  it('delete entry', async () => {
    const scope = fork({
      values: [
        [
          $userData,
          {
            username: 'my-usrname',
            userId: '1111',
          },
        ],
      ],
      handlers: [
        [getEntriesFx, () => SINGLE_ENTRY_DATA],
        [
          removeEntryFx,
          ({ entryId, boxId }: RemoveEntryOpts) => ({ entryId, boxId }),
        ],
      ],
    });

    render(<Component scope={scope} />);

    expect(
      await screen.findByText(SINGLE_ENTRY_DATA.entries[0].entryText)
    ).toBeInTheDocument();

    const deleteBtn = await screen.findByTitle(
      translations.rus.translation['entryCard.remove']
    );

    await userEvent.click(deleteBtn);

    const deleteDialog = await screen.findByText(
      translations.rus.translation['entryCard.confirmRemove']
    );

    await userEvent.click(deleteDialog);

    expect(
      screen.queryByText(SINGLE_ENTRY_DATA.entries[0].entryText)
    ).not.toBeInTheDocument();
  });
});
