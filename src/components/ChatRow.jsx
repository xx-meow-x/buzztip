import { Avatar } from './Avatar'
import { useApp } from '../store/AppContext'
import { conversationMeta, personById } from '../store/selectors'
import { timeAgo } from '../lib/format'

// One chat in a list. `card` gives the boxed style used on Home.
export function ChatRow({ conv, onClick, card = false }) {
  const { state, me } = useApp()
  const meta = conversationMeta(state, conv, me)
  const last = conv.messages[conv.messages.length - 1]
  let preview = 'No messages yet'
  if (last) {
    const who = last.system ? '' : last.from === me.id ? 'You: ' : conv.type === 'group' ? personById(state, last.from).name.split(' ')[0] + ': ' : ''
    preview = who + last.text
  }
  return (
    <button className={card ? 'chat' : 'crow'} onClick={onClick}>
      <Avatar initials={meta.initials} color={meta.color} />
      <div className="m">
        <b>{meta.title}{meta.group?.course && <span className="pill course">Course</span>}</b>
        <p>{preview}</p>
      </div>
      <div className="r">{last ? timeAgo(last.at) : ''}{conv.unread ? <span className="badge">{conv.unread}</span> : null}</div>
    </button>
  )
}
