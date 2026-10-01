import { useNavigate } from 'react-router-dom'
import { Field, Sheet } from '../components/Sheet'
import { fromInputs, toDateInput } from '../lib/format'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function EventForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const navigate = useNavigate()
  const tomorrow = new Date(Date.now() + 86_400_000)
  const f = useForm({ title: '', date: toDateInput(tomorrow), time: '13:00', venue: '', category: 'Social', host: me.name })
  function submit() {
    if (!f.validate({ title: required('Name your event.'), venue: required('Add where it happens.') })) return
    const { title, date, time, venue, category, host } = f.values
    api.createEvent({ title: title.trim(), at: fromInputs(date, time), venue: venue.trim(), category, host: host.trim() || me.name })
    closeSheet()
    navigate('/events')
    toast('Event created. You’re marked as going.')
  }
  return (
    <Sheet title="🎪 New Event" onSubmit={submit}>
      <Field id="f-title" label="Event Name" required error={f.errors.title}><input {...f.bind('title')} placeholder="e.g. Study Jam for Midterms" autoFocus /></Field>
      <div className="row2">
        <Field id="f-date" label="Date"><input type="date" {...f.bind('date')} /></Field>
        <Field id="f-time" label="Time"><input type="time" {...f.bind('time')} /></Field>
      </div>
      <Field id="f-venue" label="Venue" required error={f.errors.venue}><input {...f.bind('venue')} placeholder="e.g. Library, 2nd floor" /></Field>
      <div className="row2">
        <Field id="f-category" label="Category">
          <select {...f.bind('category')}>{['Social', 'Academic', 'Tech', 'Culture', 'Sports', 'Finance'].map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field id="f-host" label="Host"><input {...f.bind('host')} /></Field>
      </div>
      <button className="btn primary" type="submit">Create Event</button>
    </Sheet>
  )
}
