import { createRoot } from 'react-dom/client';

import './index.css';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import App from './App.tsx';
import { appStarted } from '@/shared/init.ts';

appStarted();
const root = createRoot(document.getElementById('root')!);

root.render(<App />);
