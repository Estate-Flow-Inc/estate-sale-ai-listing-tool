import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PROVIDER_IDS } from '@/providers'
import { clearKeysOnLeave } from '@/lib/apiKeyStorage'
import { restoreAndPersist } from '@/store/persist'

clearKeysOnLeave(PROVIDER_IDS)
void restoreAndPersist()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
