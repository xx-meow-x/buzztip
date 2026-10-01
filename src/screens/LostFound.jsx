import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ICONS } from '../assets/icons'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { Segmented } from '../components/Segmented'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { dmId, personById } from '../store/selectors'
import { initials, shortDate } from '../lib/format'

export default function LostFound() {
  const { state, me, api } = useApp()
  const { openSheet, toast } = useUI()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const all = state.lostFound
  const nLost = all.filter((x) => x.kind === 'lost').length
  const t = q.trim().toLowerCase()
  const rows = all.filter((x) => (tab === 'all' || x.kind === tab) && (!t || `${x.title} ${x.where} ${x.body} ${x.category}`.toLowerCase().includes(t)))

  function message(personId, text) {
    api.ensureDm(personId)
    if (text) api.sendMessage(dmId(me.id, personId), text)
    navigate(`/chats/${dmId(me.id, personId)}`)
  }
  function claim(x) {
    const text = x.kind === 'lost'
      ? `Hi! I think I found your ${x.title}. Where can we meet?`
      : `Hi! I think the ${x.title} you found is mine. Can I pick it up?`
    toast(`Message sent to ${personById(state, x.by).name}.`)
    message(x.by, text)
  }

  return (
    <section className="screen">
      <ScreenHeader title="Lost & Found" />
      <div className="h-body" style={{ paddingBottom: 20 }}>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items or location..." aria-label="Search items or location" />
        <Segmented className="lf-seg" value={tab} onChange={setTab} options={[{ value: 'all', label: 'All' }, { value: 'lost', label: `${ICONS.lost} Lost` }, { value: 'found', label: `${ICONS.found} Found` }]} />
        <div className="stats">
          <div className="stat"><b className="c-acc">{all.length}</b><small>Total Posts</small></div>
          <div className="stat"><b className="c-lost">{nLost}</b><small>Lost</small></div>
          <div className="stat"><b className="c-found">{all.length - nLost}</b><small>Found</small></div>
        </div>
        {rows.length ? rows.map((x) => {
          const who = personById(state, x.by)
          const mine = x.by === me.id
          return (
            <article key={x.id} className={`lf ${x.kind}${x.resolved ? ' done' : ''}`}>
              <div className="top"><div className="tags"><span className={`pill ${x.kind}`}>{x.kind.toUpperCase()}</span><span className="pill">{x.category}</span></div>{shortDate(x.at)}</div>
              <h4>{x.title}</h4>
              <p>{x.body}</p>
              <div className="where">
                <span><Icon name="pin" size={14} />{x.where}</span>
                <span><i className="mini" style={{ background: who.color }}>{initials(who.name)}</i>{mine ? 'You' : who.name}</span>
              </div>
              {mine ? (
                <button className={x.resolved ? 'ab' : 'resolved'} style={{ width: '100%' }} onClick={() => api.resolveLostFound(x.id)}>
                  {x.resolved ? 'Reopen post' : '✓ Mark as resolved'}
                </button>
              ) : x.resolved ? (
                <div className="resolved">✓ Resolved</div>
              ) : (
                <div className="acts">
                  <button className="ab" onClick={() => message(x.by)}>{ICONS.chats} Message</button>
                  {x.kind === 'lost'
                    ? <button className="ab found" onClick={() => claim(x)}>I found this!</button>
                    : <button className="ab mine" onClick={() => claim(x)}>This is mine!</button>}
                </div>
              )}
            </article>
          )
        }) : <p className="empty">No items match your search.</p>}
      </div>
      <div className="lf-foot">
        <button className="rb lost" onClick={() => openSheet('lostFound', { kind: 'lost' })}>{ICONS.lost} Report Lost</button>
        <button className="rb found" onClick={() => openSheet('lostFound', { kind: 'found' })}>{ICONS.found} Report Found</button>
      </div>
    </section>
  )
}
