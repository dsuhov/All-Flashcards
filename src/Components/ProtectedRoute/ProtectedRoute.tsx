import { Outlet, Navigate } from 'react-router';
import { useUnit } from 'effector-react';

import { $userData } from '@/models/auth';

export const ProtectedRoute = () => {
  const user = useUnit($userData);

  return user ? <Outlet /> : <Navigate to="auth" replace />;
};
