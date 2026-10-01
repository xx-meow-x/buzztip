// Read-only helpers for looking things up in app state.
import { PEOPLE } from '../data/seed'
import { initials } from '../lib/format'

export const dmId = (a, b) => 'dm_' + [a, b].sort().join('_')

export function personById(state, id) {
  return state.users.find((u) => u.id === id) || PEOPLE.find((p) => p.id === id) || { id, name: 'Unknown', color: '#888' }
}

// Course groups: you're in them if you're enrolled in the course.
// Everything else: you're in it if you joined.
export const isMember = (group, user) =>
  !!user && (group.course ? user.courses.includes(group.course) : group.memberIds.includes(user.id))

export const memberCount = (group, user) =>
  group.course ? group.baseMembers + (isMember(group, user) ? 1 : 0) : group.baseMembers + group.memberIds.length

export const groupConversation = (state, groupId) => state.conversations.find((c) => c.groupId === groupId)

export function visibleConversations(state, me) {
  if (!me) return []
  return state.conversations
    .filter((c) => {
      if (c.type === 'dm') return c.memberIds.includes(me.id)
      const g = state.groups.find((x) => x.id === c.groupId)
      return g && isMember(g, me)
    })
    .sort((a, b) => lastAt(b) - lastAt(a))
}

export const lastAt = (c) => (c.messages.length ? c.messages[c.messages.length - 1].at : 0)

// Title, avatar and subtitle for a chat row or header
export function conversationMeta(state, conv, me) {
  if (conv.type === 'dm') {
    const other = personById(state, conv.memberIds.find((id) => id !== me?.id))
    return { title: other.name, initials: initials(other.name), color: other.color, subtitle: 'Direct message' }
  }
  const g = state.groups.find((x) => x.id === conv.groupId)
  if (!g) return { title: 'Group', initials: 'G', color: '#888', subtitle: '' }
  return {
    title: g.shortName || g.name,
    initials: g.course ? g.course.replace(/\s+/g, '').slice(0, 3) : initials(g.name),
    color: g.color,
    subtitle: `${memberCount(g, me)} members${g.course ? ' · Course chat' : ''}`,
    group: g,
  }
}

export const totalUnread = (state, me) => visibleConversations(state, me).reduce((n, c) => n + (c.unread || 0), 0)
