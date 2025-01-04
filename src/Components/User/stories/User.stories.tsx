import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UserSettings } from '@/types/user';

import { User } from '../User';

type Story = StoryObj<typeof User>;

const meta: Meta<typeof User> = {
  title: 'User',
  component: User,
  parameters: {
    layout: 'centered',
  },
};

export const UserStory: Story = {
  args: {
    username: 'Демидрол Суходрищев',
    onExit: fn(),
    onChangeSettings: async (data: UserSettings) => {
      alert(JSON.stringify(data, null, ' '));
      return;
    },
    userSettings: {
      language: 'rus',
      studySessionCards: 5,
      theme: 'light',
    },
  },
};

export default meta;
