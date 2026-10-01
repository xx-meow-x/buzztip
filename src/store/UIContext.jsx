import { createContext, useCallback, useContext, useRef, useState } from 'react'

// Bottom sheets and toasts, available from any screen.
const UICtx = createContext(null)

export function UIProvider({ children }) {
  const [sheet, setSheet] = useState(null) // { type, props }
  const [toastMsg, setToastMsg] = useState(null)
  const timer = useRef()

  const openSheet = useCallback((type, props = {}) => setSheet({ type, props }), [])
  const closeSheet = useCallback(() => setSheet(null), [])
  const toast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(null), 2400)
  }, [])

  return <UICtx.Provider value={{ sheet, openSheet, closeSheet, toast, toastMsg }}>{children}</UICtx.Provider>
}

export const useUI = () => useContext(UICtx)
