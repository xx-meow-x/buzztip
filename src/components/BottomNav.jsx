import { NavLink } from 'react-router-dom'
import { ICONS } from '../assets/icons'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { totalUnread } from '../store/selectors'

export function BottomNav({ fab = true }) {
  const { state, me } = useApp()
  const { openSheet } = useUI()
  const unread = totalUnread(state, me)
  const tab = (to, icon, label, badge) => (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'on' : '')}>
      <span className="nav-ic">{icon}{badge ? <i className="nav-dot">{badge > 9 ? '9+' : badge}</i> : null}</span>{label}
    </NavLink>
  )
  return (
    <>
      <nav className="nav" aria-label="Main">
        {tab('/home', ICONS.home, 'Home')}
        {tab('/chats', ICONS.chats, 'Chats', unread)}
        {tab('/profile', ICONS.profile, 'Profile')}
      </nav>
      {fab && <button className="fab" aria-label="Create new" onClick={() => openSheet('create')}>+</button>}
    </>
  )
}
