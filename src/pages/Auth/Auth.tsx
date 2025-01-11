import { Navigate } from 'react-router';
import { useUnit } from 'effector-react';
import { Container, Flex } from '@gravity-ui/uikit';

import { $userData } from '@/models/auth';
import { AuthForm } from '@/Components/AuthForm';

export const Auth = () => {
  const user = useUnit($userData);

  if (user !== null) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="m">
      <Flex
        style={{ minHeight: '100dvh' }}
        justifyContent="center"
        alignItems="center"
      >
        <AuthForm />
      </Flex>
    </Container>
  );
};
