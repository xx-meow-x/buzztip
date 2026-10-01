import { Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'
import { useApp } from '../store/AppContext'

export default function Welcome() {
  const { me } = useApp()
  const navigate = useNavigate()
  if (me) return <Navigate to="/home" replace />
  return (
    <section className="screen scroll">
      <div className="topbar"><span /><ThemeToggle /></div>
      <div className="hero">
        <div className="logo"><Logo size={76} /></div>
        <h1>BUZZTIP</h1>
        <p className="tag">Connect. Communicate. Campus.</p>
        <p className="blurb">Your campus buzz in one place: announcements, chats, events and more.</p>
      </div>
      <div className="actions">
        <button className="btn primary" onClick={() => navigate('/register')}>Get started</button>
        <button className="btn secondary" onClick={() => navigate('/login')}>Log in</button>
      </div>
    </section>
  )
}
