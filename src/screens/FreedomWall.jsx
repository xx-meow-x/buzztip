import { useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { Logo } from '../components/Logo'
import { ScreenHeader } from '../components/ScreenHeader'
import { ICONS } from '../assets/icons'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { timeAgo } from '../lib/format'

const MAX = 280

export default function FreedomWall() {
  const { state, me, api } = useApp()
  const { toast } = useUI()
  const [text, setText] = useState('')

  function post() {
    const t = text.trim()
    if (!t) return
    api.createWallPost(t)
    setText('')
    toast('Posted anonymously.')
  }

  return (
    <section className="screen">
      <ScreenHeader title="Freedom Wall" />
      <div className="h-body">
        <div className="fw-new">
          <textarea id="fw-in" value={text} onChange={(e) => setText(e.target.value)} maxLength={MAX} placeholder="Share something anonymously..." aria-label="Share something anonymously" />
          <div className="bar"><span>Your name is never shown · {text.length}/{MAX}</span><button className="jb" onClick={post} disabled={!text.trim()}>Post</button></div>
        </div>
        {state.wall.map((w) => {
          const on = w.buzzedBy.includes(me.id)
          return (
            <article key={w.id} className="fw">
              <div className="who2"><div className="av"><Logo size={24} /></div>{w.alias}{w.authorId === me.id && <span className="pill">yours</span>}<time>{timeAgo(w.at)}</time></div>
              <p>{w.body}</p>
              <button className={`buzz${on ? ' on' : ''}`} onClick={() => api.toggleBuzz(w.id)} aria-pressed={on} aria-label="Buzz this post">{ICONS.buzz} {w.baseBuzz + w.buzzedBy.length}</button>
            </article>
          )
        })}
      </div>
      <BottomNav />
    </section>
  )
}
