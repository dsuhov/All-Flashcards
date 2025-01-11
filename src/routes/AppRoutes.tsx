import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from '@/Components/Layout';
import { ProtectedRoute } from '@/Components/ProtectedRoute';
import { Auth } from '@/pages/Auth';
import { useUnit } from 'effector-react';
import { $userStatus } from '@/models/auth';

export const AppRoutes = () => {
  const isUserChecked = useUnit($userStatus);

  if (!isUserChecked) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<h1>Content</h1>} />
          </Route>
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
