import ReactDOMClient from 'react-dom/client';
import { Toaster } from '@gravity-ui/uikit';
Toaster.injectReactDOMClient(ReactDOMClient);
export const toaster = new Toaster();
