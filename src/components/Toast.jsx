import { useUI } from '../store/UIContext'

export function Toast() {
  const { toastMsg } = useUI()
  return toastMsg ? <div className="toast" role="status">{toastMsg}</div> : null
}
