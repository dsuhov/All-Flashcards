import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const themeBg =
        ctx.parameters.backgrounds.values.find(
          (value) => value.value === ctx.globals.backgrounds?.value
        )?.name || 'light';

      return (
        <ThemeProvider theme={themeBg}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
