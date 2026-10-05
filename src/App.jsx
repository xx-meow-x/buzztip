import { useState } from 'react'                         
import { Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { Toast } from './components/Toast'
import { SheetHost } from './sheets'
import SplashScreen from './components/SplashScreen'     
import Welcome from './screens/Welcome'
import Register from './screens/Register'
import Login from './screens/Login'
import Home from './screens/Home'
import Chats from './screens/Chats'
import Conversation from './screens/Conversation'
import Groups from './screens/Groups'
import Feed from './screens/Feed'
import Announcements from './screens/Announcements'
import Events from './screens/Events'
import LostFound from './screens/LostFound'
import Reminders from './screens/Reminders'
import Marketplace from './screens/Marketplace'
import FreedomWall from './screens/FreedomWall'
import Profile from './screens/Profile'

const PROTECTED = [
  ['/home', Home],
  ['/chats', Chats],
  ['/chats/:id', Conversation],
  ['/groups', Groups],
  ['/feed', Feed],
  ['/announcements', Announcements],
  ['/events', Events],
  ['/lost-found', LostFound],
  ['/reminders', Reminders],
  ['/marketplace', Marketplace],
  ['/freedom-wall', FreedomWall],
  ['/profile', Profile],
]

export default function App() {
  const [booting, setBooting] = useState(true)          

  return (
    <main className="phone">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {PROTECTED.map(([path, Screen]) => (
          <Route key={path} path={path} element={<RequireAuth><Screen /></RequireAuth>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SheetHost />
      <Toast />
      {booting && <SplashScreen onFinish={() => setBooting(false)} />} 
    </main>
  )
}
