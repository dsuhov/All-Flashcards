// import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ConfirmLearnModal } from './ConfirmLearnModal';

import { fn } from '@storybook/test';

type Story = StoryObj<typeof ConfirmLearnModal>;

const meta: Meta<typeof ConfirmLearnModal> = {
  title: 'Confirm Learn Modal',
  component: ConfirmLearnModal,

  decorators: [
    (Story, props) => {
      return (
        <div>
          <Story {...props} />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'centered',
  },
};

export const ConfirmLearnModalStory: Story = {
  args: {
    open: false,
    onClose: fn(),
    onLearnMore: fn(),
    onToDecks: fn(),
    toLearnQuantity: 5,
  },
};

export default meta;
