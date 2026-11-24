import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './theme.css'

/* Every page ships as prerendered HTML (scripts/prerender.mjs) so search
   engines and no-JS visitors get full content. The app then takes over the
   same markup in the browser. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
