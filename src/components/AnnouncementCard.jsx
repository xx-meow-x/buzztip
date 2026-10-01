import { useState } from 'react'
import { Icon } from './Icon'
import { useApp } from '../store/AppContext'
import { timeAgo } from '../lib/format'

export function AnnouncementCard({ a, compact = false }) {
  const { me, api } = useApp()
  const [open, setOpen] = useState(false)
  const saved = a.savedBy.includes(me.id)
  return (
    <article className={`ann ann-x${a.urgent ? ' urgent' : ''}`}>
      <div className="tags">{a.urgent && <span className="pill u">URGENT</span>}<span className="pill">{a.category}</span></div>
      <h4>{a.title}</h4>
      <p className={open ? '' : 'clip'}>{a.body}</p>
      {!compact && (
        <div className="meta">
          <span>{a.by} · {timeAgo(a.at)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className={`save${saved ? ' on' : ''}`} onClick={() => api.toggleSaveAnnouncement(a.id)} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save post'}>
              <Icon name="bookmark" size={18} filled={saved} />
            </button>
            <button className="save more" onClick={() => setOpen(!open)}>{open ? 'Show less' : 'Read more'}</button>
          </span>
        </div>
      )}
    </article>
  )
}
