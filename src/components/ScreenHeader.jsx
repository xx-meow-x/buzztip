import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { ThemeToggle } from './ThemeToggle'

// Back arrow, centered title, theme toggle. `back` is a path or -1 for history.
export function ScreenHeader({ title, back = '/home', children, className = '' }) {
  const navigate = useNavigate()
  return (
    <header className={`s-head ${className}`}>
      <button className="iconbtn" onClick={() => navigate(back)} aria-label="Back"><Icon name="back" /></button>
      {children || <h2>{title}</h2>}
      <ThemeToggle />
    </header>
  )
}
