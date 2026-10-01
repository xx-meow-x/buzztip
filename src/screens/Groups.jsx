import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { Segmented } from '../components/Segmented'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { groupConversation, isMember, memberCount } from '../store/selectors'
import { initials } from '../lib/format'

export default function Groups() {
  const { state, me, api } = useApp()
  const { openSheet, toast } = useUI()
  const navigate = useNavigate()
  const [tab, setTab] = useState('mine')

  let rows = state.groups
  if (tab === 'mine') rows = rows.filter((g) => isMember(g, me)).sort((a, b) => (b.course ? 1 : 0) - (a.course ? 1 : 0))
  if (tab === 'popular') rows = [...rows].sort((a, b) => memberCount(b, me) - memberCount(a, me))
  if (tab === 'discover') rows = rows.filter((g) => !isMember(g, me) && !g.course)

  function openChat(g) {
    const c = groupConversation(state, g.id)
    if (c && isMember(g, me)) navigate(`/chats/${c.id}`)
  }
  function toggle(g) {
    const joining = !isMember(g, me)
    api.toggleGroup(g.id)
    toast(joining ? `Joined ${g.name}. Its group chat is now in Chats.` : `Left ${g.name}.`)
  }

  return (
    <section className="screen">
      <ScreenHeader title="Groups" />
      <div className="h-body">
        <Segmented value={tab} onChange={setTab} options={[{ value: 'mine', label: 'My Groups' }, { value: 'popular', label: 'Popular' }, { value: 'discover', label: 'Discover' }]} />
        <button className="btn secondary small" onClick={() => openSheet('group')}>+ Create a group</button>
        {rows.length ? rows.map((g) => {
          const joined = isMember(g, me)
          return (
            <div key={g.id} className="grow">
              <button className="grow-main" onClick={() => openChat(g)} disabled={!joined} aria-label={joined ? `Open ${g.name} chat` : g.name}>
                <Avatar initials={g.course ? g.course.replace(/\s+/g, '').slice(0, 3) : initials(g.name)} color={g.color} />
                <div className="m"><b>{g.name}</b><span className="pill">{g.category}</span><small>{memberCount(g, me)} members</small></div>
              </button>
              {g.course
                ? <span className="pill course" title="Added from your enrollment">{joined ? 'Enrolled' : 'Not enrolled'}</span>
                : <button className={`jb${joined ? ' joined' : ''}`} onClick={() => toggle(g)}>{joined ? 'Joined' : 'Join'}</button>}
            </div>
          )
        }) : <p className="empty">{tab === 'mine' ? 'You haven’t joined any groups yet. Try the Discover tab.' : 'You’ve joined every group. Create a new one above.'}</p>}
        {tab === 'mine' && <p className="note">Course groups are added from your enrollment and update each term.</p>}
      </div>
      <BottomNav />
    </section>
  )
}
