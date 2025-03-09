import { BrowserRouter } from 'react-router';
import { render, screen, fireEvent } from '@testing-library/react';
import { Link } from '..';

describe('Link test', () => {
  test('Link navigates to route', async () => {
    render(
      <BrowserRouter>
        <Link href="some">Link</Link>
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByText('Link'));

    expect(window.location.pathname).toBe('/some');
  });
});
