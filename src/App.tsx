import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@gravity-ui/uikit';

function App() {
  return (
    <ThemeProvider theme="light">
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
