import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'
import { AVATAR_COLORS } from '../data/seed'
import { hashPassword, validateRegistration } from '../lib/auth'
import { getEnrolledCourses } from '../lib/enrollment'
import { uid } from '../lib/format'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'

export default function Register() {
  const { state, api } = useApp()
  const { toast } = useUI()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', label: 'Student' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    const errs = validateRegistration({ ...form, users: state.users })
    if (!form.name.trim()) errs.name = 'Enter your name.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const user = {
      id: uid('u'),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      passHash: await hashPassword(form.password),
      label: form.label,
      program: '',
      // TODO: look up real enrollment with the student number once that exists
      courses: getEnrolledCourses(),
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      createdAt: Date.now(),
    }
    api.registerUser(user)
    toast(`Welcome, ${user.name.split(' ')[0]}! Your course group chats are ready.`)
    navigate('/home', { replace: true })
  }

  return (
    <section className="screen scroll">
      <div className="topbar">
        <button className="back" onClick={() => navigate('/')}><Icon name="back" size={18} />Back</button>
        <ThemeToggle />
      </div>
      <form className="form-wrap" onSubmit={submit} noValidate>
        <div className="brand"><Logo size={34} /><div><b>BUZZTIP</b><small>Create an account</small></div></div>
        <h2>Create an Account</h2>
        <p className="sub">Join your campus community</p>
        <div className="field">
          <label htmlFor="r-name">Full Name</label>
          <input id="r-name" value={form.name} onChange={set('name')} placeholder="Juan Dela Cruz" autoComplete="name" />
          {errors.name && <div className="err">{errors.name}</div>}
        </div>
        <div className="field">
          <label htmlFor="r-email">TIP Email</label>
          <input id="r-email" type="email" value={form.email} onChange={set('email')} placeholder="youremail@tip.edu.ph" autoComplete="email" />
          {errors.email && <div className="err">{errors.email}</div>}
        </div>
        <div className="field">
          <label htmlFor="r-pass">Password</label>
          <input id="r-pass" type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" autoComplete="new-password" />
          {errors.password && <div className="err">{errors.password}</div>}
        </div>
        <div className="field">
          <label htmlFor="r-label">I am a</label>
          <select id="r-label" value={form.label} onChange={set('label')}>
            <option>Student</option><option>Faculty</option><option>Staff</option><option>Alumni</option>
          </select>
        </div>
        <button className="btn primary" type="submit" disabled={busy}>Register</button>
        <p className="switch">Already have an account? <button type="button" onClick={() => navigate('/login')}>Log in</button></p>
      </form>
    </section>
  )
}
