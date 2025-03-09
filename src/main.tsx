import { createRoot } from 'react-dom/client';

import './index.css';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import { init } from '@/app/init.ts';
import App from './app/App.tsx';

init();

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
