import { initials as toInitials } from '../lib/format'

// Square avatar. Pass `src` for a photo; otherwise it shows initials on a color.
export function Avatar({ name = '', initials, color = '#888', src, size = 38, className = '', children }) {
  const style = { width: size, height: size, background: src ? 'var(--surface-2)' : color, fontSize: Math.max(10, size * 0.32) }
  return (
    <div className={`av ${className}`} style={style} aria-hidden="true">
      {src ? <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : children || initials || toInitials(name)}
    </div>
  )
}
