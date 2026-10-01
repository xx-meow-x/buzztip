import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { useApp } from '../store/AppContext'

export default function Announcements() {
  const { state, me } = useApp()
  const [params] = useSearchParams()
  const [cat, setCat] = useState(params.has('saved') ? 'Saved' : 'All')
  const cats = ['All', 'Urgent', 'Saved', ...new Set(state.announcements.map((a) => a.category))]
  const rows = state.announcements
    .filter((a) => cat === 'All' || (cat === 'Urgent' ? a.urgent : cat === 'Saved' ? a.savedBy.includes(me.id) : a.category === cat))
    .sort((a, b) => b.at - a.at)
  return (
    <section className="screen">
      <ScreenHeader title="Announcements" />
      <div className="h-body">
        <div className="chips" role="tablist">
          {cats.map((c) => <button key={c} className={`chip${c === cat ? ' on' : ''}`} onClick={() => setCat(c)} aria-pressed={c === cat}>{c}</button>)}
        </div>
        {rows.length ? rows.map((a) => <AnnouncementCard key={a.id} a={a} />)
          : <p className="empty">{cat === 'Saved' ? 'Nothing saved yet. Tap the bookmark on an announcement to keep it here.' : 'No announcements in this category yet.'}</p>}
      </div>
      <BottomNav />
    </section>
  )
}
