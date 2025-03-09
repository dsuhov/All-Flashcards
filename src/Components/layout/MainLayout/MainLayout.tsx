import { Outlet } from 'react-router';
import { Container } from '@gravity-ui/uikit';

import { Header } from '@/Components/widgets/Header';
import styles from './styles.module.css';

export const MainLayout = () => {
  return (
    <Container maxWidth="m" className={styles.container}>
      <Header />
      <Outlet />
    </Container>
  );
};
