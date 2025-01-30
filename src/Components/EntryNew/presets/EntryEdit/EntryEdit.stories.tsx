import type { Meta, StoryObj } from '@storybook/react';

import { EntryEdit } from './EntryEdit';
import { fn } from '@storybook/test';
import { EntryId } from '@/types/entry';
type Story = StoryObj<typeof EntryEdit>;

const meta: Meta<typeof EntryEdit> = {
  title: 'Entry Editable',
  component: EntryEdit,
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

export const EntryEditStory: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    entryId: '1' as EntryId,
    entryText: 'Some text',
    definitions: [
      {
        text: 'Some definition',
        examples: ['Some example'],
      },
    ],
    transcription: 'Some transcription',
    currentBox: 5,
    pending: false,
  },
};

export default meta;
