import { useNavigate } from 'react-router-dom'
import { Field, Sheet } from '../components/Sheet'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function PostForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const navigate = useNavigate()
  const f = useForm({ body: '', category: 'General' })
  function submit() {
    if (!f.validate({ body: required('Write something before posting.') })) return
    api.createPost({ body: f.values.body.trim(), category: f.values.category })
    closeSheet()
    navigate('/feed')
    toast('Posted to the Campus Feed.')
  }
  return (
    <Sheet title="📝 New Post" onSubmit={submit}>
      <Field id="f-body" label="What's on your mind?" required error={f.errors.body}>
        <textarea {...f.bind('body')} maxLength={500} placeholder="Share an update, ask a question, find study buddies..." autoFocus />
      </Field>
      <Field id="f-category" label="Topic">
        <select {...f.bind('category')}>{['General', 'Academic', 'Tech', 'Org', 'Sports', 'Question'].map((c) => <option key={c}>{c}</option>)}</select>
      </Field>
      <button className="btn primary" type="submit">Post</button>
    </Sheet>
  )
}
