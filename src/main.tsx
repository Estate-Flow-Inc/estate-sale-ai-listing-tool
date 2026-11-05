import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PROVIDER_IDS } from '@/providers'
import { clearKeysOnLeave } from '@/lib/apiKeyStorage'
import { restoreAndPersist } from '@/store/persist'
import { watchRunForAlerts } from '@/lib/runAlerts'

clearKeysOnLeave(PROVIDER_IDS)
void restoreAndPersist()
watchRunForAlerts()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
