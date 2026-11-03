import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PROVIDER_IDS } from '@/providers'
import { clearKeysOnLeave } from '@/lib/apiKeyStorage'

clearKeysOnLeave(PROVIDER_IDS)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
