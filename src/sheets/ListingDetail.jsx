import { useNavigate } from 'react-router-dom'
import { Sheet } from '../components/Sheet'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { dmId, personById } from '../store/selectors'
import { peso, timeAgo } from '../lib/format'

export default function ListingDetail({ id }) {
  const { state, me, api } = useApp()
  const { closeSheet } = useUI()
  const navigate = useNavigate()
  const l = state.listings.find((x) => x.id === id)
  if (!l) return null
  const mine = l.by === me.id
  const seller = personById(state, l.by)

  function message() {
    api.ensureDm(l.by)
    api.sendMessage(dmId(me.id, l.by), `Hi! Is your ${l.title} still available?`)
    closeSheet()
    navigate(`/chats/${dmId(me.id, l.by)}`)
  }

  return (
    <Sheet title={l.title} className="mk-d">
      <div className="ph">{l.image ? <img src={l.image} alt="" /> : l.icon}</div>
      <div className="price">{peso(l.price)}{l.sold && <span className="pill late" style={{ marginLeft: 8 }}>SOLD</span>}</div>
      <div className="sl"><span className="pill">{l.condition}</span><span>{mine ? 'Your listing' : `Sold by ${seller.name}`} · {timeAgo(l.at)}</span></div>
      <p>{l.body}</p>
      {mine
        ? <button className="btn secondary" onClick={() => api.toggleSold(l.id)}>{l.sold ? 'Mark as available' : 'Mark as sold'}</button>
        : <button className="btn primary" onClick={message} disabled={l.sold}>{l.sold ? 'This item is sold' : '💬 Message Seller'}</button>}
    </Sheet>
  )
}
