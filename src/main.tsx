import { createRoot } from 'react-dom/client'
import { jsx } from 'react/jsx-runtime'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
