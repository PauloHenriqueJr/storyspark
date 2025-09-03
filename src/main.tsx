import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initHTTPSEnforcement } from './utils/https'

// Initialize HTTPS enforcement as early as possible
initHTTPSEnforcement();

createRoot(document.getElementById("root")!).render(<App />);
