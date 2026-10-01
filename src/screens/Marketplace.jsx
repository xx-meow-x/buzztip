import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { personById } from '../store/selectors'
import { peso } from '../lib/format'

export default function Marketplace() {
  const { state, me } = useApp()
  const { openSheet } = useUI()
  const [q, setQ] = useState('')
  const t = q.trim().toLowerCase()
  const rows = state.listings.filter((l) => !t || `${l.title} ${l.condition}`.toLowerCase().includes(t))
  return (
    <section className="screen">
      <ScreenHeader title="Marketplace" />
      <div className="h-body">
        <div className="toolbar">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items..." aria-label="Search items" />
          <button className="jb" onClick={() => openSheet('listing')}>+ Sell</button>
        </div>
        <div className="mk-grid">
          {rows.length ? rows.map((l) => (
            <button key={l.id} className={`mk${l.sold ? ' sold' : ''}`} onClick={() => openSheet('item', { id: l.id })}>
              <div className="ph">{l.image ? <img src={l.image} alt="" /> : l.icon}{l.sold && <span className="sold-tag">SOLD</span>}</div>
              <b>{l.title}</b>
              <div className="price">{peso(l.price)}</div>
              <div className="sl"><span>{l.by === me.id ? 'You' : personById(state, l.by).name}</span><span className="pill">{l.condition}</span></div>
            </button>
          )) : <p className="empty" style={{ gridColumn: '1/-1' }}>No listings match your search.</p>}
        </div>
      </div>
      <BottomNav />
    </section>
  )
}
