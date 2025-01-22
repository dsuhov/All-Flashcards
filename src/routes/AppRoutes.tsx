import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useUnit } from 'effector-react';

import { Layout } from '@/Components/Layout';
import { ProtectedRoute } from '@/Components/ProtectedRoute';
import { Auth } from '@/pages/Auth';
import { HomePage } from '@/pages/HomePage';

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
            <Route index element={<HomePage />} />
            {/* <Route path="some/path" element={<h1>some</h1>} /> */}
          </Route>
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
