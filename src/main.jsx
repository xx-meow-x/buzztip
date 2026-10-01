import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { UIProvider } from './store/UIContext'
import { initTheme } from './lib/theme'
import App from './App'
import './styles/global.css'

initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* HashRouter works on any static host with no server config. Swap to BrowserRouter once you have a server. */}
    <HashRouter>
      <AppProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </AppProvider>
    </HashRouter>
  </StrictMode>
)
