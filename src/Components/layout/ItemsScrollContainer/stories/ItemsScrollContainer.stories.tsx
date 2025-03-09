import type { Meta, StoryObj } from '@storybook/react';

import { ItemsScrollContainer } from '..';
import styles from './styles.module.css';

type Story = StoryObj<typeof ItemsScrollContainer>;

const meta: Meta<typeof ItemsScrollContainer> = {
  title: 'Items Scroll Container',
  component: ItemsScrollContainer,
  parameters: {
    layout: 'centered',
  },
};

const items = Array.from({ length: 20 }, (_, i) => (
  <div
    style={{ padding: '10px', border: '1px dashed #bada55' }}
    key={i.toString()}
  >{`element ${i + 1}`}</div>
));

export const ItemsScrollContainerStory: Story = {
  decorators: (Story) => (
    <div className={styles.cont}>
      <Story />
    </div>
  ),
  args: {
    items,
  },
};

export default meta;
