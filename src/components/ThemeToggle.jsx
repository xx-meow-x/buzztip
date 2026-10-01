import { toggleTheme, useTheme } from '../lib/theme'
import { Icon } from './Icon'

export function ThemeToggle() {
  const theme = useTheme()
  return (
    <button className="iconbtn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  )
}
