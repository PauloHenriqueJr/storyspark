import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAnalytics } from './integrations/analytics/googleAnalytics';

initAnalytics();
createRoot(document.getElementById('root')!).render(<App />);
