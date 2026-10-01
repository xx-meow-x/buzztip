import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ICONS } from '../assets/icons'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { Avatar } from '../components/Avatar'
import { BottomNav } from '../components/BottomNav'
import { ChatRow } from '../components/ChatRow'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { PostCard } from '../components/PostCard'
import { ThemeToggle } from '../components/ThemeToggle'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { visibleConversations } from '../store/selectors'

const TILES = [
  ['/chats', ICONS.chats, 'Chats'],
  ['/announcements', ICONS.announcements, 'Admin'],
  ['/events', ICONS.events, 'Events'],
  ['/reminders', ICONS.reminders, 'Remind'],
  ['/marketplace', ICONS.marketplace, 'Market'],
  ['/groups', ICONS.groups, 'Groups'],
  ['/lost-found', ICONS.lostFound, 'Lost+'],
  ['/freedom-wall', ICONS.freedomWall, 'Freedom'],
]

export default function Home() {
  const { state, me, api } = useApp()
  const { toast } = useUI()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState('')

  const chats = visibleConversations(state, me).slice(0, 3)
  const anns = [...state.announcements].sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.at - a.at).slice(0, 2)
  const posts = state.posts.slice(0, 2)
  const results = useSearch(state, q)

  const go = (to) => { setMenuOpen(false); navigate(to) }
  const soon = (what) => { setMenuOpen(false); toast(`${what} is coming in a later version.`) }

  return (
    <section className={`screen${menuOpen ? ' open' : ''}`}>
      <header className="h-head">
        <div className="b"><Logo size={28} />BUZZTIP</div>
        <div className="h-actions">
          <ThemeToggle />
          <button className="iconbtn" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
        </div>
      </header>

      <div className="h-body">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search BUZZTIP..." aria-label="Search BUZZTIP" />

        {q.trim() ? (
          <div className="results">
            {results.length ? results.map((r) => (
              <button key={r.key} className="result" onClick={() => navigate(r.to)}>
                <span className="pill">{r.type}</span><b>{r.title}</b>
              </button>
            )) : <p className="empty">Nothing matches “{q}”.</p>}
          </div>
        ) : (
          <>
            <div className="grid">
              {TILES.map(([to, icon, label]) => (
                <button key={to} className="tile" onClick={() => navigate(to)}><span>{icon}</span>{label}</button>
              ))}
            </div>

            <div className="sec"><h3>Recent Chats</h3><button onClick={() => navigate('/chats')}>See all</button></div>
            <div className="list">
              {chats.map((c) => <ChatRow key={c.id} conv={c} card onClick={() => navigate(`/chats/${c.id}`)} />)}
            </div>

            <div className="sec"><h3>Announcements</h3><button onClick={() => navigate('/announcements')}>See all</button></div>
            <div className="list">{anns.map((a) => <AnnouncementCard key={a.id} a={a} compact />)}</div>

            <div className="sec"><h3>Campus Feed</h3><button onClick={() => navigate('/feed')}>See all</button></div>
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </>
        )}
      </div>

      <BottomNav />

      <div className="scrim" onClick={() => setMenuOpen(false)} />
      <aside className="drawer" aria-label="Menu" aria-hidden={!menuOpen}>
        <div className="u-head"><Avatar name={me.name} color="var(--surface-2)" size={44} src={me.avatar}>{ICONS.profile}</Avatar><div><b>{me.name}</b><small>{me.email}</small></div></div>
        <button className="mi on" onClick={() => setMenuOpen(false)}>{ICONS.home} Home</button>
        <button className="mi" onClick={() => go('/chats')}>{ICONS.chats} Chats</button>
        <button className="mi" onClick={() => go('/groups')}>{ICONS.groups} Groups</button>
        <button className="mi" onClick={() => go('/feed')}>{ICONS.feed} Campus Feed</button>
        <button className="mi" onClick={() => go('/announcements')}>{ICONS.announcements} Announcements</button>
        <button className="mi" onClick={() => go('/events')}>{ICONS.events} Events</button>
        <button className="mi" onClick={() => go('/reminders')}>{ICONS.reminders} Reminders</button>
        <button className="mi" onClick={() => go('/marketplace')}>{ICONS.marketplace} Marketplace</button>
        <button className="mi" onClick={() => go('/lost-found')}>{ICONS.lostFound} Lost &amp; Found</button>
        <button className="mi" onClick={() => go('/freedom-wall')}>{ICONS.freedomWall} Freedom Wall</button>
        <hr />
        <button className="mi" onClick={() => go('/announcements?saved')}>{ICONS.saved} Saved Posts</button>
        <button className="mi" onClick={() => soon('My Files')}>{ICONS.files} My Files</button>
        <button className="mi" onClick={() => go('/profile')}>{ICONS.settings} Settings</button>
        <button className="mi" onClick={() => soon('Help & Support')}>{ICONS.help} Help &amp; Support</button>
        <button className="mi red" onClick={() => { api.logout(); navigate('/', { replace: true }) }}>{ICONS.logout} Log Out</button>
      </aside>
    </section>
  )
}

function useSearch(state, q) {
  return useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    const hit = (...xs) => xs.join(' ').toLowerCase().includes(t)
    return [
      ...state.groups.filter((g) => hit(g.name, g.category)).map((g) => ({ key: g.id, type: 'Group', title: g.name, to: '/groups' })),
      ...state.announcements.filter((a) => hit(a.title, a.body)).map((a) => ({ key: a.id, type: 'Announcement', title: a.title, to: '/announcements' })),
      ...state.events.filter((e) => hit(e.title, e.venue)).map((e) => ({ key: e.id, type: 'Event', title: e.title, to: '/events' })),
      ...state.listings.filter((l) => hit(l.title)).map((l) => ({ key: l.id, type: 'Marketplace', title: l.title, to: '/marketplace' })),
      ...state.lostFound.filter((l) => hit(l.title, l.where)).map((l) => ({ key: l.id, type: 'Lost & Found', title: l.title, to: '/lost-found' })),
      ...state.posts.filter((p) => hit(p.body)).map((p) => ({ key: p.id, type: 'Post', title: p.body.slice(0, 60) + (p.body.length > 60 ? '…' : ''), to: '/feed' })),
    ].slice(0, 20)
  }, [state, q])
}
