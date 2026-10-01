import { Field, Sheet } from '../components/Sheet'
import { fromInputs, toDateInput } from '../lib/format'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function ReminderForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ title: '', date: toDateInput(new Date(Date.now() + 86_400_000)), time: '08:00' })
  function submit() {
    if (!f.validate({ title: required('Give your reminder a title.') })) return
    api.createReminder({ title: f.values.title.trim(), at: fromInputs(f.values.date, f.values.time) })
    closeSheet()
    toast('Reminder saved.')
  }
  return (
    <Sheet title="🔔 New Reminder" onSubmit={submit}>
      <Field id="f-title" label="Title" required error={f.errors.title}><input {...f.bind('title')} placeholder="e.g. CS399 Assignment" autoFocus /></Field>
      <div className="row2">
        <Field id="f-date" label="Date"><input type="date" {...f.bind('date')} /></Field>
        <Field id="f-time" label="Time"><input type="time" {...f.bind('time')} /></Field>
      </div>
      <button className="btn primary" type="submit">Save Reminder</button>
    </Sheet>
  )
}
