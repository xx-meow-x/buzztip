import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Field, Sheet } from '../components/Sheet'
import { AVATAR_COLORS, PEOPLE } from '../data/seed'
import { uid } from '../lib/format'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function GroupForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const navigate = useNavigate()
  const f = useForm({ name: '', category: 'Academic', description: '', members: [] })
  const toggle = (id) => f.setValues((v) => ({ ...v, members: v.members.includes(id) ? v.members.filter((x) => x !== id) : [...v.members, id] }))

  function submit() {
    if (!f.validate({ name: required('Give your group a name.') })) return
    const id = uid('g')
    api.createGroup({
      id,
      name: f.values.name.trim(),
      category: f.values.category,
      description: f.values.description.trim(),
      memberIds: f.values.members,
      color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    })
    closeSheet()
    navigate(`/chats/c_${id}`)
    toast('Group created. Say hi!')
  }

  return (
    <Sheet title="👥 New Group" onSubmit={submit}>
      <Field id="f-name" label="Group Name" required error={f.errors.name}>
        <input {...f.bind('name')} placeholder="e.g. CS 305 Capstone Team" autoFocus />
      </Field>
      <Field id="f-category" label="Category">
        <select {...f.bind('category')}>{['Academic', 'Organization', 'Culture', 'Tech', 'Sports', 'Governance', 'Friends', 'Other'].map((c) => <option key={c}>{c}</option>)}</select>
      </Field>
      <Field id="f-description" label="Description">
        <input {...f.bind('description')} placeholder="What's this group for?" />
      </Field>
      <div className="field">
        <label>Add Members <span className="hint">{f.values.members.length} selected</span></label>
        <div className="people">
          {PEOPLE.map((p) => {
            const on = f.values.members.includes(p.id)
            return (
              <button type="button" key={p.id} className={`person${on ? ' on' : ''}`} onClick={() => toggle(p.id)} aria-pressed={on}>
                <Avatar name={p.name} color={p.color} size={24} />{p.name.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>
      <button className="btn primary" type="submit">Create Group</button>
    </Sheet>
  )
}
