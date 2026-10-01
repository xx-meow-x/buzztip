import { BottomNav } from '../components/BottomNav'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { clock, shortDate } from '../lib/format'

export default function Reminders() {
  const { state, me, api } = useApp()
  const { openSheet } = useUI()
  const mine = state.reminders.filter((r) => r.ownerId === me.id)
  const upcoming = mine.filter((r) => !r.done).sort((a, b) => a.at - b.at)
  const done = mine.filter((r) => r.done)

  const Row = (r) => {
    const late = !r.done && r.at < Date.now()
    return (
      <div key={r.id} className={`rem${late ? ' late' : ''}${r.done ? ' done' : ''}`}>
        <button className="ck" onClick={() => api.toggleReminder(r.id)} aria-label={r.done ? 'Mark as not done' : 'Mark as done'}><Icon name="check" size={14} strokeWidth={3} /></button>
        <div className="m"><b>{r.title}</b><small>{shortDate(r.at)} · {clock(r.at)}{late ? ' · Overdue' : ''}</small></div>
        {late && <span className="pill late">LATE</span>}
        {r.done && <button className="del" onClick={() => api.deleteReminder(r.id)} aria-label="Delete reminder">×</button>}
      </div>
    )
  }

  return (
    <section className="screen">
      <ScreenHeader title="Reminders" />
      <div className="h-body">
        <h3 className="r-h">Upcoming</h3>
        {upcoming.length ? upcoming.map(Row) : <p className="empty" style={{ padding: 14 }}>Nothing coming up. Add a reminder below.</p>}
        {done.length > 0 && <><h3 className="r-h" style={{ marginTop: 20 }}>Completed</h3>{done.map(Row)}</>}
        <button className="btn primary" style={{ marginTop: 6 }} onClick={() => openSheet('reminder')}>+ Add Reminder</button>
      </div>
      <BottomNav />
    </section>
  )
}
