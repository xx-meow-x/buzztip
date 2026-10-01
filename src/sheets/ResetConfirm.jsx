import { Sheet } from '../components/Sheet'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'

export default function ResetConfirm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  return (
    <Sheet title="Reset demo data?">
      <p className="sheet-p">This restores the sample chats, posts and listings and removes everything you added in this browser, including accounts you registered.</p>
      <button className="btn lostfill" onClick={() => { api.resetDemo(); closeSheet(); toast('Demo data restored.') }}>Reset everything</button>
      <button className="cancel" onClick={closeSheet}>Keep my data</button>
    </Sheet>
  )
}
