import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { Segmented } from '../components/Segmented'
import { useApp } from '../store/AppContext'
import { clock, weekday } from '../lib/format'

export default function Events() {
  const { state, me, api } = useApp()
  const [tab, setTab] = useState('up')
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const isPast = (e) => (e.holiday ? e.at < startOfToday : e.at < Date.now())
  const rows = state.events
    .filter((e) => (tab === 'past' ? isPast(e) : !isPast(e)))
    .sort((a, b) => (tab === 'past' ? b.at - a.at : a.at - b.at))

  return (
    <section className="screen">
      <ScreenHeader title="Events" />
      <div className="h-body">
        <Segmented value={tab} onChange={setTab} options={[{ value: 'up', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} />
        {rows.length ? rows.map((e) => {
          const going = e.goingIds.includes(me.id)
          const past = isPast(e)
          const d = new Date(e.at)
          let status = null
          if (!e.holiday) {
            if (past) status = going ? <span className="going">✓ Went</span> : null
            else status = going
              ? <button className="going" onClick={() => api.toggleGoing(e.id)} aria-label="Cancel RSVP">✓ Going</button>
              : <button className="rsvp" onClick={() => api.toggleGoing(e.id)}>RSVP</button>
          }
          return (
            <article key={e.id} className={`ev${past ? ' past' : ''}`}>
              <div className={`date${going ? ' on' : ''}`}>
                <small>{d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</small>
                <b>{String(d.getDate()).padStart(2, '0')}</b>
              </div>
              <div className="m">
                <div className="row"><h4>{e.title}</h4>{status}</div>
                <div className="loc"><Icon name="pin" size={13} />{e.venue}</div>
                <div className="tm2">{weekday(e.at)} · {e.holiday ? 'All day' : clock(e.at)}{e.host ? ` · ${e.host}` : ''}{!e.holiday && e.goingIds.length ? ` · ${e.goingIds.length} going` : ''}</div>
                <span className="pill">{e.category}</span>
              </div>
            </article>
          )
        }) : <p className="empty">{tab === 'up' ? 'No upcoming events. Create one with the + button.' : 'No past events yet.'}</p>}
      </div>
      <BottomNav />
    </section>
  )
}
