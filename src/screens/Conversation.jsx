import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { ScreenHeader } from '../components/ScreenHeader'
import { useApp } from '../store/AppContext'
import { conversationMeta, personById, visibleConversations } from '../store/selectors'
import { clock } from '../lib/format'

export default function Conversation() {
  const { id } = useParams()
  const { state, me, api, activeConversation } = useApp()
  const [text, setText] = useState('')
  const box = useRef(null)
  const conv = state.conversations.find((c) => c.id === id)
  const allowed = conv && visibleConversations(state, me).some((c) => c.id === id)

  // Tell the store this chat is open so new replies don't count as unread
  useEffect(() => {
    activeConversation.current = id
    return () => { activeConversation.current = null }
  }, [id, activeConversation])

  const count = conv?.messages.length || 0
  useEffect(() => {
    if (conv?.unread) api.markRead(id)
    if (box.current) box.current.scrollTop = box.current.scrollHeight
  }, [count, id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!allowed) return <Navigate to="/chats" replace />
  const meta = conversationMeta(state, conv, me)

  function send(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    api.sendMessage(id, t)
    setText('')
  }

  return (
    <section className="screen">
      <ScreenHeader back="/chats" className="cv">
        <div className="who">
          <Avatar initials={meta.initials} color={meta.color} size={34} />
          <div><b>{meta.title}</b><small>{meta.subtitle}</small></div>
        </div>
      </ScreenHeader>
      <div className="msgs" ref={box}>
        {conv.messages.length === 0 && <p className="empty">Say hi to start the conversation.</p>}
        {conv.messages.map((m) => {
          if (m.system) return <p key={m.id} className="sys">{m.text}</p>
          const mine = m.from === me.id
          return (
            <div key={m.id} className={`msg ${mine ? 'out' : 'in'}`}>
              {!mine && conv.type === 'group' && <span className="nm">{personById(state, m.from).name}</span>}
              <div className="bub">{m.text}</div>
              <span className="tm">{clock(m.at)}</span>
            </div>
          )
        })}
      </div>
      <form className="composer" onSubmit={send}>
        <input id="cv-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." aria-label="Message" autoComplete="off" />
        <button className="send" type="submit" aria-label="Send" disabled={!text.trim()}><Icon name="send" /></button>
      </form>
    </section>
  )
}
