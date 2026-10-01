export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={`seg ${className}`} style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }} role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} data-t={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}
