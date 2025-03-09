import type { Meta, StoryObj } from '@storybook/react';

import { AddDeck } from '../AddDeck';
import { fn } from '@storybook/test';

type Story = StoryObj<typeof AddDeck>;

const meta: Meta<typeof AddDeck> = {
  title: 'Add Deck',
  component: AddDeck,
  parameters: {
    layout: 'centered',
  },
};

export const AddDeckStory: Story = {
  args: {
    onAddDeckClick: fn(),
    inputFieldOpen: false,
    onDeckNameInputChange: fn(),
    onSave: fn(),
    deckNameNameValue: '',
    pending: false,
  },
};

export default meta;
