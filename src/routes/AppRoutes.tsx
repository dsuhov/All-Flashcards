import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from '@/Components/Layout';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Content</h1>} />
        </Route>
        <Route path="/login" element={<h2>Login page</h2>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
