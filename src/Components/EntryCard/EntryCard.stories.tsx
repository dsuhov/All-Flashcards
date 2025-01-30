import type { Meta, StoryObj } from '@storybook/react';

import { EntryCard } from '../EntryCard';
import { fn } from '@storybook/test';

type Story = StoryObj<typeof EntryCard>;

const meta: Meta<typeof EntryCard> = {
  title: 'Entry Card',
  component: EntryCard,
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

export const EntryCardStory: Story = {
  args: {
    entryText: 'hiatus',
    transcription: 'haɪˈeɪdəs',
    definitions: [
      {
        text: `<p class="short" style="box-sizing: border-box; margin: 0px 0px 10px; line-height: normal; font-size: 18px; color: rgb(51, 51, 51); font-family: &quot;open sans&quot;, arial, helvetica, sans-serif; background-color: rgb(255, 255, 255);">A temporary gap, pause, break, or absence can be called a&nbsp;<i style="box-sizing: border-box;">hiatus</i>. When your favorite TV show is on&nbsp;<i style="box-sizing: border-box;">hiatus</i>, that means there are no new episodes — not forever, just for a little while.</p><br><br><p class="long" style="box-sizing: border-box; margin: 0px 0px 1em; line-height: normal; font-size: 14px; color: rgb(51, 51, 51); font-family: &quot;open sans&quot;, arial, helvetica, sans-serif; background-color: rgb(255, 255, 255);">Even things that go on for a long time take a break once in a while: one kind of break is a hiatus. If someone has to leave her job for a time, she's going on hiatus. A touring band will need to take a hiatus if the lead singer gets in an accident. The key thing about a hiatus is that it's an interruption of something that was happening, but it's not a permanent break.</p>`,
        examples: [
          'After their three-week hiatus, the young players borrowed an old automobile from the editor of the California Chess Reporter, Guthrie McClain.',
          'The detailed reasons for the hiatus are outside the scope of this book.\nThe Scientists by John Gribbin',
        ],
      },
      {
        text: `a natural opening or perforation through a <i>bone or a membranous structure</i>`,
      },
      {
        text: `a missing piece (as a gap in a manuscript)`,
      },
    ],
    currentBox: 4,
    onDelete: fn(),
  },
};

export default meta;
