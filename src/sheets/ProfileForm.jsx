import { Field, Sheet } from '../components/Sheet'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function ProfileForm() {
  const { me, api } = useApp()
  const { closeSheet, toast } = useUI()
  const f = useForm({ name: me.name, label: me.label || 'Student', program: me.program || '', avatar: me.avatar || '' })
  function onPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const r = new FileReader()
    r.onload = () => f.setValues((v) => ({ ...v, avatar: r.result }))
    r.readAsDataURL(file)
  }
  function submit() {
    if (!f.validate({ name: required('Your name can’t be empty.') })) return
    api.updateProfile({ ...f.values, name: f.values.name.trim(), avatar: f.values.avatar || undefined })
    closeSheet()
    toast('Profile updated.')
  }
  return (
    <Sheet title="✏️ Edit Profile" onSubmit={submit}>
      <Field id="f-name" label="Display Name" required error={f.errors.name}><input {...f.bind('name')} /></Field>
      <div className="row2">
        <Field id="f-label" label="Role">
          <select {...f.bind('label')}>{['Student', 'Faculty', 'Staff', 'Alumni'].map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
        <Field id="f-program" label="Program"><input {...f.bind('program')} placeholder="e.g. BS CS" /></Field>
      </div>
      <Field id="f-avatar" label="Profile Picture"><input id="f-avatar" type="file" accept="image/*" onChange={onPhoto} className="file" /></Field>
      {f.values.avatar && <div className="row-inline"><img src={f.values.avatar} alt="Profile picture preview" className="avatar-prev" /><button type="button" className="link" onClick={() => f.setValues((v) => ({ ...v, avatar: '' }))}>Remove photo</button></div>}
      <button className="btn primary" type="submit">Save Changes</button>
    </Sheet>
  )
}
