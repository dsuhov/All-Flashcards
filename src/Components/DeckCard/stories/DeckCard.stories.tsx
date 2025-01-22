import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router';

import { DeckId } from '@/types/entry';
import { DeckCard } from '../DeckCard';
import { fn } from '@storybook/test';

type Story = StoryObj<typeof DeckCard>;

const meta: Meta<typeof DeckCard> = {
  title: 'Deck Card',
  component: DeckCard,
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '200px',
          }}
        >
          <div
            style={{
              flexGrow: 1,
              maxWidth: '800px',
            }}
          >
            <BrowserRouter>
              <Story />
            </BrowserRouter>
          </div>
        </div>
      );
    },
  ],
};

export const DeckCardStory: Story = {
  args: {
    deckId: '2323424234234' as DeckId,
    title: 'Всякое',
    linkTitle: 'vsyakoe',
    entriesQuantity: 0,
    entriesToLearn: 0,
    onMellowing: 0,
    onDelete: fn(),
  },
};

export default meta;
