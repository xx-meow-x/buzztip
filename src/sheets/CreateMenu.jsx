import { useNavigate } from 'react-router-dom'
import { ICONS } from '../assets/icons'
import { Sheet } from '../components/Sheet'
import { useUI } from '../store/UIContext'

const OPTIONS = [
  ['post', ICONS.post, 'New Post', 'Share something with the campus'],
  ['group', ICONS.groupChat, 'Group Chat', 'Start a group and invite classmates'],
  ['event', ICONS.events, 'Campus Event', 'Organize a campus event'],
  ['announcement', ICONS.announcements, 'Announcement', 'Post an official announcement'],
  ['lostFound', ICONS.lostFound, 'Lost & Found', 'Report a lost or found item'],
  ['wall', ICONS.freedomWall, 'Freedom Wall', 'Post anonymously'],
  ['listing', ICONS.marketplace, 'Marketplace Listing', 'Sell or trade something'],
]

export default function CreateMenu() {
  const { openSheet, closeSheet } = useUI()
  const navigate = useNavigate()
  function pick(type) {
    if (type === 'wall') {
      closeSheet()
      navigate('/freedom-wall')
      setTimeout(() => document.getElementById('fw-in')?.focus(), 80)
    } else openSheet(type, type === 'lostFound' ? { kind: 'lost' } : {})
  }
  return (
    <Sheet title="What would you like to create?">
      {OPTIONS.map(([type, icon, title, sub]) => (
        <button key={type} className="opt" onClick={() => pick(type)}>
          <span className="ic">{icon}</span><span className="m"><b>{title}</b><small>{sub}</small></span><span className="chev">›</span>
        </button>
      ))}
      <button className="cancel" onClick={closeSheet}>Cancel</button>
    </Sheet>
  )
}
