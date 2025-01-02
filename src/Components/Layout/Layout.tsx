import { Outlet } from 'react-router';
import { Container } from '@gravity-ui/uikit';

import { Header } from '@/Components/Header';

export const Layout = () => {
  return (
    <Container maxWidth="m">
      <Header />
      <Outlet />
    </Container>
  );
};
