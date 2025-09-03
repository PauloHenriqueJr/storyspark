import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force HTTPS in production
if (import.meta.env.PROD && location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}

createRoot(document.getElementById("root")!).render(<App />);
