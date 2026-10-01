// The bee logo. Replace src/assets/logo.svg with your own file to change it everywhere.
import logo from '../assets/logo.svg'

export const Logo = ({ size = 28, alt = '' }) => <img src={logo} width={size} height={size} alt={alt} style={{ display: 'block' }} />
