// All bottom sheets, opened from anywhere with openSheet('<name>', props).
import { useUI } from '../store/UIContext'
import CreateMenu from './CreateMenu'
import PostForm from './PostForm'
import GroupForm from './GroupForm'
import AnnouncementForm from './AnnouncementForm'
import EventForm from './EventForm'
import LostFoundForm from './LostFoundForm'
import ReminderForm from './ReminderForm'
import ListingForm from './ListingForm'
import ListingDetail from './ListingDetail'
import ProfileForm from './ProfileForm'
import ResetConfirm from './ResetConfirm'

const SHEETS = {
  create: CreateMenu,
  post: PostForm,
  group: GroupForm,
  announcement: AnnouncementForm,
  event: EventForm,
  lostFound: LostFoundForm,
  reminder: ReminderForm,
  listing: ListingForm,
  item: ListingDetail,
  profile: ProfileForm,
  reset: ResetConfirm,
}

export function SheetHost() {
  const { sheet } = useUI()
  if (!sheet) return null
  const C = SHEETS[sheet.type]
  return C ? <C key={sheet.type + JSON.stringify(sheet.props)} {...sheet.props} /> : null
}
