import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../data/seed'
import { hashPassword } from '../lib/auth'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'

export default function Login() {
  const { state, api } = useApp()
  const { toast } = useUI()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    const user = state.users.find((u) => u.email === email.trim().toLowerCase())
    if (!user || user.passHash !== (await hashPassword(password))) {
      setError('That email and password don’t match an account. Check them and try again.')
      return
    }
    api.login(user.id)
    navigate('/home', { replace: true })
  }

  return (
    <section className="screen scroll">
      <div className="topbar">
        <button className="back" onClick={() => navigate('/')}><Icon name="back" size={18} />Back</button>
        <ThemeToggle />
      </div>
      <form className="form-wrap" onSubmit={submit} noValidate>
        <div className="brand"><Logo size={34} /><div><b>BUZZTIP</b><small>Welcome back</small></div></div>
        <h2>Welcome Back</h2>
        <p className="sub">Sign in to continue</p>
        <div className="field"><label htmlFor="l-email">TIP Email</label><input id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="youremail@tip.edu.ph" autoComplete="email" /></div>
        <div className="field"><label htmlFor="l-pass">Password</label><input id="l-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" /></div>
        {error && <div className="err" role="alert" style={{ margin: '-6px 0 12px' }}>{error}</div>}
        <button className="link" type="button" onClick={() => toast('Password reset will work once the backend is connected.')}>Forgot password?</button>
        <button className="btn primary" type="submit">Sign in</button>
        <div className="demo-hint">
          <span>Demo account: <b>{DEMO_EMAIL}</b> · <b>{DEMO_PASSWORD}</b></span>
          <button type="button" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError('') }}>Fill in</button>
        </div>
        <p className="switch">New here? <button type="button" onClick={() => navigate('/register')}>Create an account</button></p>
      </form>
    </section>
  )
}
