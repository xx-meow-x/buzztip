import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createSeed } from '../data/seed'
import { DATA_VERSION, SIMULATE_REPLIES } from '../config'
import { load, save } from '../lib/storage'
import * as actions from './actions'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = load()
    return saved && saved.version === DATA_VERSION ? saved : createSeed()
  })

  useEffect(() => save(state), [state])

  // Which chat is open right now, so simulated replies don't count as unread there.
  const activeConversation = useRef(null)

  const api = useMemo(() => {
    const bound = {}
    for (const [name, fn] of Object.entries(actions)) {
      if (typeof fn === 'function' && name !== 'isMember') bound[name] = (...args) => setState((s) => fn(s, ...args))
    }
    bound.sendMessage = (convId, text) => {
      bound.postMessage(convId, text)
      if (SIMULATE_REPLIES) {
        setTimeout(
          () => setState((s) => actions.simulateReply(s, convId, activeConversation.current === convId)),
          1200 + Math.random() * 1500
        )
      }
    }
    // Wipes saved data and restores the demo content. Keeps you logged in.
    bound.resetDemo = () =>
      setState((s) => {
        const fresh = createSeed()
        const stillExists = fresh.users.some((u) => u.id === s.session?.userId)
        return { ...fresh, session: stillExists ? s.session : null }
      })
    return bound
  }, [])

  const me = state.users.find((u) => u.id === state.session?.userId) || null

  return <AppCtx.Provider value={{ state, me, api, activeConversation }}>{children}</AppCtx.Provider>
}

export const useApp = () => useContext(AppCtx)
