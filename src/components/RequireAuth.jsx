import { Navigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export function RequireAuth({ children }) {
  const { me } = useApp()
  return me ? children : <Navigate to="/" replace />
}
