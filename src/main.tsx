import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import './styles.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Prerendered pages arrive with markup to hydrate; `npm run dev` serves an empty shell.
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
