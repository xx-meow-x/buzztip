import { useEffect, useState } from 'react'

const KEY = 'bt-theme'
const root = () => document.documentElement

function current() {
  return root().getAttribute('data-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function initTheme() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) root().setAttribute('data-theme', saved)
  } catch { /* ignore */ }
}

const listeners = new Set()

export function toggleTheme() {
  const next = current() === 'dark' ? 'light' : 'dark'
  root().setAttribute('data-theme', next)
  try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
  listeners.forEach((fn) => fn(next))
}

export function useTheme() {
  const [theme, setTheme] = useState(current)
  useEffect(() => {
    listeners.add(setTheme)
    return () => listeners.delete(setTheme)
  }, [])
  return theme
}
