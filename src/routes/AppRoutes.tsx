import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from '@/Components/Layout';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Content</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
