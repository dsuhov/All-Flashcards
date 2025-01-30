import type { Meta, StoryObj } from '@storybook/react';

import { EntryNew } from './EntryNew';
import { fn } from '@storybook/test';

type Story = StoryObj<typeof EntryNew>;

const meta: Meta<typeof EntryNew> = {
  title: 'Entry New',
  component: EntryNew,
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '100px',
          }}
        >
          <div
            style={{
              flexGrow: 1,
              maxWidth: '800px',
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export const EntryNewStory: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
};

export default meta;
