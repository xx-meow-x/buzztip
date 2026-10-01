import { useEffect } from 'react'
import { useUI } from '../store/UIContext'

// Bottom sheet with a scrim. Use as the root of every sheet in src/sheets.
export function Sheet({ title, children, onSubmit, className = '' }) {
  const { closeSheet } = useUI()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeSheet()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSheet])
  const Body = onSubmit ? 'form' : 'div'
  return (
    <div className="overlay">
      <div className="ov-scrim" onClick={closeSheet} />
      <Body
        className={`sheet ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        noValidate={onSubmit ? true : undefined}
        onSubmit={onSubmit ? (e) => { e.preventDefault(); onSubmit(e) } : undefined}
      >
        <div className="sh-head"><h3>{title}</h3><button type="button" className="x" onClick={closeSheet} aria-label="Close">×</button></div>
        {children}
      </Body>
    </div>
  )
}

export function Field({ id, label, required, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label} {required && <span className="req">*</span>}</label>
      {children}
      {error && <div className="err" role="alert">{error}</div>}
    </div>
  )
}
