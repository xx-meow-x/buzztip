import { useEffect, useState } from 'react'
import { Logo } from './Logo'

export default function SplashScreen({ onFinish }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1600)
    const t2 = setTimeout(() => onFinish(), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFinish])

  return (
    <section className={`screen splash${leaving ? ' leaving' : ''}`}>
      <div className="hero">
        <div className="logo splash-logo">
          <Logo size={76} />
        </div>
        <h1>BUZZTIP</h1>
        <p className="tag">What's the buzz?</p>
      </div>
    </section>
  )
}
