import { AppRoutes } from '@/app/routes/AppRoutes';
import { ThemeProvider } from './providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
