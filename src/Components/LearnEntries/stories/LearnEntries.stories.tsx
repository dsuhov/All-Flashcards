import type { Meta, StoryObj } from '@storybook/react';

import { LearnEntries } from '../LearnEntries';
import { mockEntries } from './mock';

import styles from './styles.module.css';
import { fn } from '@storybook/test';

type Story = StoryObj<typeof LearnEntries>;

const meta: Meta<typeof LearnEntries> = {
  title: 'Learn Entries',
  component: LearnEntries,

  decorators: [
    (Story) => {
      return (
        <div className={styles.wrapper}>
          <Story />
        </div>
      );
    },
  ],
};

export const LearnEntriesStory: Story = {
  args: {
    entries: mockEntries,
    onLearnEnded: fn(),
    pending: false,
  },
};

export default meta;
