import { useNavigate } from 'react-router-dom'
import { ICONS } from '../assets/icons'
import { Field, Sheet } from '../components/Sheet'
import { Segmented } from '../components/Segmented'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function LostFoundForm({ kind = 'lost' }) {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const navigate = useNavigate()
  const f = useForm({ kind, title: '', category: 'Electronics', where: '', body: '' })
  const lost = f.values.kind === 'lost'
  function submit() {
    if (!f.validate({ title: required('Add the item’s name so people can find it.') })) return
    api.createLostFound({
      kind: f.values.kind,
      title: f.values.title.trim(),
      category: f.values.category,
      where: f.values.where.trim() || 'Location not specified',
      body: f.values.body.trim() || 'No description added.',
    })
    closeSheet()
    navigate('/lost-found')
    toast(lost ? 'Lost item posted.' : 'Found item posted.')
  }
  return (
    <Sheet title={lost ? <>{ICONS.lost} <span className="c-lost">Report a Lost Item</span></> : <>{ICONS.found} <span className="c-found">Report a Found Item</span></>} onSubmit={submit}>
      <Segmented className="lf-seg" value={f.values.kind} onChange={(k) => f.setValues((v) => ({ ...v, kind: k }))} options={[{ value: 'lost', label: 'I lost something' }, { value: 'found', label: 'I found something' }]} />
      <Field id="f-title" label="Item Name" required error={f.errors.title}><input {...f.bind('title')} placeholder={lost ? 'e.g. Black Calculator' : 'e.g. TIP ID Card'} autoFocus /></Field>
      <Field id="f-category" label="Category">
        <select {...f.bind('category')}>{['Electronics', 'ID / Card', 'Accessories', 'Personal Item', 'Books & Notes', 'Clothing', 'Other'].map((c) => <option key={c}>{c}</option>)}</select>
      </Field>
      <Field id="f-where" label={lost ? 'Last Seen Location' : 'Where You Found It'}><input {...f.bind('where')} placeholder="e.g. Room 204, Building B" /></Field>
      <Field id="f-body" label="Description"><textarea {...f.bind('body')} placeholder="Any identifying details, color, markings, etc." /></Field>
      <button className={`btn ${lost ? 'lostfill' : 'foundfill'}`} type="submit">{lost ? 'Post Lost Item' : 'Post Found Item'}</button>
    </Sheet>
  )
}
