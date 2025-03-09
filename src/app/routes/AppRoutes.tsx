import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useUnit } from 'effector-react';

import { MainLayout } from '@/Components/layout/MainLayout';
import { ProtectedRoute } from '@/Components/routing/ProtectedRoute';

import { Auth } from '@/pages/Auth';
import { HomePage } from '@/pages/HomePage';
import { EntriesPage } from '@/pages/EntriesPage';
import { LearnPage } from '@/pages/LearnPage';

import { DECKS_ROUTE, LEARN_ROUTE } from '@/constants';
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
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route
              path={`${DECKS_ROUTE}/:deckLink`}
              element={<EntriesPage />}
            />
            <Route
              path={`${DECKS_ROUTE}/:deckLink/${LEARN_ROUTE}`}
              element={<LearnPage />}
            />
          </Route>
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
