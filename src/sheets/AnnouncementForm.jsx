import { useNavigate } from 'react-router-dom'
import { Field, Sheet } from '../components/Sheet'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function AnnouncementForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const navigate = useNavigate()
  const f = useForm({ title: '', category: 'Academic', body: '', urgent: false, by: me.name })
  function submit() {
    if (!f.validate({ title: required('Add a title.'), body: required('Add the announcement details.') })) return
    api.createAnnouncement({ ...f.values, title: f.values.title.trim(), body: f.values.body.trim(), by: f.values.by.trim() || me.name })
    closeSheet()
    navigate('/announcements')
    toast('Announcement posted.')
  }
  return (
    <Sheet title="📢 New Announcement" onSubmit={submit}>
      <Field id="f-title" label="Title" required error={f.errors.title}><input {...f.bind('title')} placeholder="e.g. Room change for CS 301" autoFocus /></Field>
      <Field id="f-category" label="Category">
        <select {...f.bind('category')}>{['Academic', 'Finance', 'Events', 'Facilities', 'Org', 'Other'].map((c) => <option key={c}>{c}</option>)}</select>
      </Field>
      <Field id="f-body" label="Details" required error={f.errors.body}><textarea {...f.bind('body')} placeholder="What do students need to know?" /></Field>
      <Field id="f-by" label="Posted by"><input {...f.bind('by')} placeholder="Office or organization" /></Field>
      <label className="check"><input type="checkbox" id="f-urgent" checked={f.values.urgent} onChange={f.bind('urgent').onChange} /> Mark as urgent</label>
      <button className="btn primary" type="submit">Post Announcement</button>
    </Sheet>
  )
}
