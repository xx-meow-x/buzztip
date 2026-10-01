// Line icons drawn in SVG. Each takes the current text color.
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

const paths = {
  back: <path d="M15 18l-6-6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>),
  check: <path d="M5 12l5 5 9-10" />,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
}

export function Icon({ name, size = 20, filled = false, strokeWidth }) {
  if (name === 'send')
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z" /></svg>
  if (name === 'pin')
    return <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...P} strokeWidth={strokeWidth || P.strokeWidth} fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
