import { useNavigate } from 'react-router-dom'
import { ICONS } from '../assets/icons'
import { BottomNav } from '../components/BottomNav'
import { ScreenHeader } from '../components/ScreenHeader'
import { COURSE_CATALOG, courseGroupId } from '../lib/enrollment'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { groupConversation, isMember } from '../store/selectors'

export default function Profile() {
  const { state, me, api } = useApp()
  const { openSheet, toast } = useUI()
  const navigate = useNavigate()
  const posts = state.posts.filter((p) => p.authorId === me.id).length
  const groups = state.groups.filter((g) => isMember(g, me)).length
  const events = state.events.filter((e) => !e.holiday && e.goingIds.includes(me.id)).length
  const soon = (what) => toast(`${what} is coming in a later version.`)

  const Row = ({ icon, label, onClick, red }) => (
    <button className={`pm${red ? ' red' : ''}`} onClick={onClick}><span>{icon}</span><span>{label}</span>{!red && <span className="chev">›</span>}</button>
  )

  return (
    <section className="screen">
      <ScreenHeader><h2 className="wordmark">BUZZTIP</h2></ScreenHeader>
      <div className="h-body" style={{ paddingTop: 0 }}>
        <div className="p-top">
          <div className="p-av">{me.avatar ? <img src={me.avatar} alt="" /> : ICONS.profile}</div>
          <b>{me.name}</b><small>{me.email}{me.label ? ` · ${me.label}` : ''}</small>
          <div className="p-stats">
            <div><b>{posts}</b><small>Posts</small></div>
            <div><b>{groups}</b><small>Groups</small></div>
            <div><b>{events}</b><small>Events</small></div>
          </div>
        </div>

        <h3 className="r-h" style={{ marginTop: 16 }}>My Courses</h3>
        <div className="courses">
          {me.courses.map((code) => {
            const conv = groupConversation(state, courseGroupId(code))
            return (
              <button key={code} className="course-row" onClick={() => conv && navigate(`/chats/${conv.id}`)}>
                <b>{code}</b><span>{COURSE_CATALOG[code] || ''}</span><span className="chev">›</span>
              </button>
            )
          })}
          <p className="note">Detected from your enrollment. Tap a course to open its group chat.</p>
        </div>

        <Row icon={ICONS.edit} label="Edit Profile" onClick={() => openSheet('profile')} />
        <Row icon={ICONS.settings} label="Account Settings" onClick={() => soon('Account Settings')} />
        <Row icon={ICONS.privacy} label="Privacy & Security" onClick={() => soon('Privacy & Security')} />
        <Row icon={ICONS.notifications} label="Notifications" onClick={() => soon('Notifications')} />
        <Row icon={ICONS.help} label="Help & Support" onClick={() => soon('Help & Support')} />
        <Row icon={ICONS.about} label="About BUZZTIP" onClick={() => toast('BUZZTIP prototype 0.1 · Data is saved in this browser only.')} />
        <Row icon={ICONS.reset} label="Reset demo data" onClick={() => openSheet('reset')} />
        <Row icon={ICONS.logout} label="Log Out" red onClick={() => { api.logout(); navigate('/', { replace: true }) }} />
      </div>
      <BottomNav />
    </section>
  )
}
