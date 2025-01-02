import { createRoot } from 'react-dom/client';

import './index.css';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(<App />);
