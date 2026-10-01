// Every change to app state goes through one of these pure functions:
// (state, ...args) => newState. When the backend exists, each one maps
// neatly to an API call.
import { PEOPLE } from '../data/seed'
import { uid } from '../lib/format'
import { dmId, isMember } from './selectors'

const meId = (s) => s.session?.userId
const toggleIn = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id])
const mapById = (list, id, fn) => list.map((x) => (x.id === id ? fn(x) : x))

/* ---------- Accounts ---------- */
export const registerUser = (s, user) => ({ ...s, users: [...s.users, user], session: { userId: user.id } })
export const login = (s, userId) => ({ ...s, session: { userId } })
export const logout = (s) => ({ ...s, session: null })
export const updateProfile = (s, patch) => ({ ...s, users: mapById(s.users, meId(s), (u) => ({ ...u, ...patch })) })

/* ---------- Chats ---------- */
export function postMessage(s, convId, text, from = meId(s)) {
  const m = { id: uid('m'), from, text, at: Date.now() }
  return { ...s, conversations: mapById(s.conversations, convId, (c) => ({ ...c, messages: [...c.messages, m] })) }
}

export const markRead = (s, convId) => ({
  ...s,
  conversations: mapById(s.conversations, convId, (c) => (c.unread ? { ...c, unread: 0 } : c)),
})

export function ensureDm(s, personId) {
  const id = dmId(meId(s), personId)
  if (s.conversations.some((c) => c.id === id)) return s
  return { ...s, conversations: [...s.conversations, { id, type: 'dm', memberIds: [meId(s), personId], unread: 0, messages: [] }] }
}

const REPLIES = [
  'Got it, thanks!', 'Sounds good 👍', 'Noted!', 'Okay, see you there.', 'Haha true',
  'Wait, let me check.', 'Thank you!', 'Sige, I’ll message you later.', 'Nice one!',
]

// Demo only: someone answers a moment after you send something.
export function simulateReply(s, convId, isOpen) {
  const conv = s.conversations.find((c) => c.id === convId)
  if (!conv) return s
  const me = meId(s)
  let pool
  if (conv.type === 'dm') pool = conv.memberIds.filter((id) => id !== me && id.startsWith('p_'))
  else {
    const g = s.groups.find((x) => x.id === conv.groupId)
    pool = g?.course ? PEOPLE.map((p) => p.id) : (g?.memberIds || []).filter((id) => id.startsWith('p_'))
  }
  if (!pool.length) return s
  const from = pool[Math.floor(Math.random() * pool.length)]
  const text = REPLIES[Math.floor(Math.random() * REPLIES.length)]
  const next = postMessage(s, convId, text, from)
  return isOpen ? next : { ...next, conversations: mapById(next.conversations, convId, (c) => ({ ...c, unread: (c.unread || 0) + 1 })) }
}

/* ---------- Groups ---------- */
export function toggleGroup(s, groupId) {
  const g = s.groups.find((x) => x.id === groupId)
  if (!g || g.course) return s // course groups follow enrollment
  return { ...s, groups: mapById(s.groups, groupId, (x) => ({ ...x, memberIds: toggleIn(x.memberIds, meId(s)) })) }
}

export function createGroup(s, { id, name, category, description, memberIds, color }) {
  const me = meId(s)
  const group = { id, name, category, description, color, baseMembers: 0, memberIds: [me, ...memberIds] }
  const conv = {
    id: 'c_' + id, type: 'group', groupId: id, unread: 0,
    messages: [{ id: uid('m'), from: me, system: true, text: 'You created this group.', at: Date.now() }],
  }
  return { ...s, groups: [group, ...s.groups], conversations: [conv, ...s.conversations] }
}

/* ---------- Feed posts ---------- */
export const createPost = (s, { body, category }) => ({
  ...s, posts: [{ id: uid('po'), authorId: meId(s), body, category, at: Date.now(), likedBy: [] }, ...s.posts],
})
export const toggleLike = (s, id) => ({ ...s, posts: mapById(s.posts, id, (p) => ({ ...p, likedBy: toggleIn(p.likedBy, meId(s)) })) })

/* ---------- Announcements ---------- */
export const createAnnouncement = (s, a) => ({
  ...s, announcements: [{ id: uid('a'), ...a, at: Date.now(), savedBy: [] }, ...s.announcements],
})
export const toggleSaveAnnouncement = (s, id) => ({
  ...s, announcements: mapById(s.announcements, id, (a) => ({ ...a, savedBy: toggleIn(a.savedBy, meId(s)) })),
})

/* ---------- Events ---------- */
export const createEvent = (s, e) => ({ ...s, events: [...s.events, { id: uid('e'), ...e, goingIds: [meId(s)] }] })
export const toggleGoing = (s, id) => ({ ...s, events: mapById(s.events, id, (e) => ({ ...e, goingIds: toggleIn(e.goingIds, meId(s)) })) })

/* ---------- Lost & Found ---------- */
export const createLostFound = (s, item) => ({
  ...s, lostFound: [{ id: uid('lf'), ...item, by: meId(s), at: Date.now() }, ...s.lostFound],
})
export const resolveLostFound = (s, id) => ({ ...s, lostFound: mapById(s.lostFound, id, (x) => ({ ...x, resolved: !x.resolved })) })

/* ---------- Reminders ---------- */
export const createReminder = (s, { title, at }) => ({
  ...s, reminders: [...s.reminders, { id: uid('r'), ownerId: meId(s), title, at }],
})
export const toggleReminder = (s, id) => ({ ...s, reminders: mapById(s.reminders, id, (r) => ({ ...r, done: !r.done })) })
export const deleteReminder = (s, id) => ({ ...s, reminders: s.reminders.filter((r) => r.id !== id) })

/* ---------- Marketplace ---------- */
export const createListing = (s, l) => ({
  ...s, listings: [{ id: uid('m'), ...l, by: meId(s), at: Date.now() }, ...s.listings],
})
export const toggleSold = (s, id) => ({ ...s, listings: mapById(s.listings, id, (l) => ({ ...l, sold: !l.sold })) })

/* ---------- Freedom Wall ---------- */
export const createWallPost = (s, body) => ({
  ...s, wall: [{ id: uid('w'), alias: 'Anonymous Bee', body, at: Date.now(), buzzedBy: [], baseBuzz: 0, authorId: meId(s) }, ...s.wall],
})
export const toggleBuzz = (s, id) => ({ ...s, wall: mapById(s.wall, id, (w) => ({ ...w, buzzedBy: toggleIn(w.buzzedBy, meId(s)) })) })

// Exported for convenience in components
export { isMember }
