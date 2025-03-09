import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router';

import { Link } from './Link';

type Story = StoryObj<typeof Link>;

const meta: Meta<typeof Link> = {
  title: 'Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export const LinkStory: Story = {
  args: {
    children: 'Link',
    view: 'normal',
    href: '/login',
  },
  argTypes: {
    view: { control: 'select', options: ['normal', 'primary', 'secondary'] },
  },
};

export default meta;
