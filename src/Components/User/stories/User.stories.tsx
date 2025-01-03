import type { Meta, StoryObj } from '@storybook/react';

import { User } from '../User';

type Story = StoryObj<typeof User>;

const meta: Meta<typeof User> = {
  title: 'User',
  component: User,
  parameters: {
    layout: 'centered',
  },
};

export const UserStory: Story = {};

export default meta;
