import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { ChatRow } from '../components/ChatRow'
import { ScreenHeader } from '../components/ScreenHeader'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { conversationMeta, visibleConversations } from '../store/selectors'

export default function Chats() {
  const { state, me } = useApp()
  const { openSheet } = useUI()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const list = visibleConversations(state, me).filter((c) =>
    !q.trim() || conversationMeta(state, c, me).title.toLowerCase().includes(q.trim().toLowerCase())
  )
  return (
    <section className="screen">
      <ScreenHeader title="Chats" />
      <div className="h-body">
        <div className="toolbar">
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search chats..." aria-label="Search chats" />
          <button className="jb" onClick={() => openSheet('group')}>+ Group</button>
        </div>
        <div className="clist">
          {list.length ? list.map((c) => <ChatRow key={c.id} conv={c} onClick={() => navigate(`/chats/${c.id}`)} />)
            : <p className="empty">{q ? 'No chats match your search.' : 'No chats yet. Join a group or message someone to start one.'}</p>}
        </div>
      </div>
      <BottomNav />
    </section>
  )
}
