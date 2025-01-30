import type { Meta, StoryObj } from '@storybook/react';

import { AddEntryBtn } from '../AddEntryBtn';
import { fn } from '@storybook/test';

type Story = StoryObj<typeof AddEntryBtn>;

const meta: Meta<typeof AddEntryBtn> = {
  title: 'Add Entry Button',
  component: AddEntryBtn,
  parameters: {
    layout: 'centered',
  },
};

export const AddEntryBtnStory: Story = {
  decorators: [
    (Story) => (
      <div style={{ minWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onAddEntry: fn(),
  },
};

export default meta;
