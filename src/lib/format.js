const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

export const uid = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2, 9)}`

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

// "now", "5m", "3h", "Yesterday", "Sep 3"
export function timeAgo(at) {
  const diff = Date.now() - at
  if (diff < MIN) return 'now'
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`
  if (diff < 2 * DAY) return 'Yesterday'
  return new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const shortDate = (at) => new Date(at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
export const clock = (at) => new Date(at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
export const weekday = (at) => new Date(at).toLocaleDateString('en-US', { weekday: 'short' })
export const peso = (n) => '₱' + Number(n).toLocaleString('en-PH')

// For <input type="date"> / <input type="time"> values
export const toDateInput = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
export const fromInputs = (date, time = '08:00') => new Date(`${date}T${time}`).getTime()
