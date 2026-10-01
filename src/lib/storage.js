// Everything is saved in the browser for now (localStorage).
// When the backend exists, replace load/save with API calls.
const KEY = 'buzztip:data'

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}
