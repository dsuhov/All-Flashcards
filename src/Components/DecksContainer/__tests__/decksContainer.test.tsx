import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@gravity-ui/uikit';
import { fork, Scope } from 'effector';
import { Provider } from 'effector-react';
import { getDecksFx, addDeckFx } from '@/models/decks';
import { userEvent } from '@testing-library/user-event';

import { LEARN_ROUTE, DECKS_ROUTE } from '@/constants';
import '@/i18n/i18n.config';
import { DecksContainer } from '../DecksContainer';
import { dummyDecks, dummyBoxes } from '../mocks/mockData';
import { DEFAULT_TEST_ID } from '@/Components/DeckCard/constants';
import { $userData } from '@/models/auth';

const slugMini = (str: string) => str.toLowerCase().replace(/\s/, '_');

jest.mock('slug', () => (arg: string) => slugMini(arg));

jest.mock('../../../firebase.config.ts', () => {
  return {};
});

describe('Decks Container tests', () => {
  const Component = ({ scope }: { scope: Scope }) => (
    <BrowserRouter>
      <ThemeProvider>
        <Provider value={scope}>
          <DecksContainer />
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  );

  it('renders components with no decks', async () => {
    const scope = fork({
      handlers: [
        [addDeckFx, () => []],
        [getDecksFx, () => ({ decks: [], boxes: [] })],
      ],
    });

    render(<Component scope={scope} />);

    expect(await screen.findByText('Добавить набор')).toBeInTheDocument();
    expect(await screen.queryByText('Deck title 0')).not.toBeInTheDocument();
  });

  it('add deck and click on it', async () => {
    const scope = fork({
      handlers: [
        [getDecksFx, () => ({ decks: [], boxes: [] })],
        [
          addDeckFx,
          ({ newDeckName }: { newDeckName: string }) => ({
            deckId: Math.round(Math.random() * 10000).toString(),
            title: newDeckName,
            linkTitle: slugMini(newDeckName),
          }),
        ],
      ],
    });
    render(<Component scope={scope} />);

    userEvent.click(await screen.findByText('Добавить набор'));

    const nameInput = await screen.findByPlaceholderText('Название набора');

    await userEvent.type(nameInput, 'Deck title');
    await userEvent.click(await screen.findByText('Сохранить'));

    const deck = await screen.findByText(/Deck title/);
    expect(deck).toBeInTheDocument();
    expect(await screen.findByText(/Всего: 0/)).toBeInTheDocument();

    await userEvent.click(deck);

    expect(window.location.pathname).toBe(
      `/${DECKS_ROUTE}/${slugMini('Deck title')}`
    );
  });

  it('renders components with decks', async () => {
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
        [getDecksFx, () => ({ decks: dummyDecks, boxes: dummyBoxes })],
        [addDeckFx, () => {}],
      ],
    });
    render(<Component scope={scope} />);

    const decks = await screen.findAllByTestId(DEFAULT_TEST_ID);
    expect(await screen.findByText('Добавить набор')).toBeInTheDocument();
    expect(decks).toHaveLength(dummyDecks.length);
    await new Promise<void>((res) =>
      setTimeout(() => {
        res();
      }, 500)
    );

    expect(await within(decks[0]).findByText(`Всего: 5`));
    expect(await within(decks[0]).findByText(`На созревании: 3`));
    expect(await within(decks[0]).findByText(`Выучено: 1`));
    expect(await within(decks[0]).findByText(`Учить: 1`));
  });

  it('on Learn button goes to page learn', async () => {
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
        [getDecksFx, () => ({ decks: dummyDecks, boxes: dummyBoxes })],
        [addDeckFx, () => {}],
      ],
    });
    render(<Component scope={scope} />);

    const deckLearnBtn = await screen.findByText('Учить: 1');
    await userEvent.click(deckLearnBtn);

    expect(window.location.pathname).toBe(
      `/${DECKS_ROUTE}/${dummyDecks[0].linkTitle}/${LEARN_ROUTE}`
    );
  });

  it('add deck to existing decks', async () => {
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
        [getDecksFx, () => ({ decks: dummyDecks, boxes: dummyBoxes })],
        [
          addDeckFx,
          ({ newDeckName }: { newDeckName: string }) => ({
            deckId: Math.round(Math.random() * 10000).toString(),
            title: newDeckName,
            linkTitle: slugMini(newDeckName),
          }),
        ],
      ],
    });
    render(<Component scope={scope} />);

    userEvent.click(await screen.findByText('Добавить набор'));

    const nameInput = await screen.findByPlaceholderText('Название набора');

    await userEvent.type(nameInput, 'My new deck');
    await userEvent.click(await screen.findByText('Сохранить'));

    const decks = await screen.findAllByTestId(DEFAULT_TEST_ID);
    expect(decks).toHaveLength(dummyDecks.length + 1);

    expect(await screen.findByText(/My new deck/)).toBeInTheDocument();
  });
});
