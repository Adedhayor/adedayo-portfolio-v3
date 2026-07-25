import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { SensoryUIProvider } from '@/lib/sensory-ui'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Class-based theming — `.dark` on <html> drives the semantic overrides */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* UI sound (synthesized, silent until something plays a role).
            /play nests its own provider with the world's pack config. */}
        <SensoryUIProvider>
          <App />
        </SensoryUIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
