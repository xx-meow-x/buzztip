import { useNavigate } from 'react-router-dom'
import { Field, Sheet } from '../components/Sheet'
import { ICONS } from '../assets/icons'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'
import { required, useForm } from './useForm'

export default function ListingForm() {
  const { api } = useApp()
  const { closeSheet, toast } = useUI()
  const navigate = useNavigate()
  const f = useForm({ title: '', price: '', condition: 'Good', body: '', image: '' })

  function onPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => f.setValues((v) => ({ ...v, image: reader.result }))
    reader.readAsDataURL(file)
  }

  function submit() {
    const ok = f.validate({
      title: required('Add an item name.'),
      price: (v) => (v === '' || Number(v) < 0 ? 'Add a price of ₱0 or more.' : null),
    })
    if (!ok) return
    api.createListing({
      title: f.values.title.trim(),
      price: Number(f.values.price),
      condition: f.values.condition,
      body: f.values.body.trim() || 'No description added.',
      icon: ICONS.listing,
      image: f.values.image || undefined,
    })
    closeSheet()
    navigate('/marketplace')
    toast('Listing posted.')
  }

  return (
    <Sheet title="🛒 New Listing" onSubmit={submit}>
      <Field id="f-title" label="Item Name" required error={f.errors.title}><input {...f.bind('title')} placeholder="e.g. Physics Lab Manual" autoFocus /></Field>
      <div className="row2">
        <Field id="f-price" label="Price (₱)" required error={f.errors.price}><input type="number" min="0" inputMode="numeric" {...f.bind('price')} placeholder="250" /></Field>
        <Field id="f-condition" label="Condition">
          <select {...f.bind('condition')}>{['Brand New', 'Like New', 'Good', 'Fair'].map((c) => <option key={c}>{c}</option>)}</select>
        </Field>
      </div>
      <Field id="f-body" label="Description"><textarea {...f.bind('body')} placeholder="Edition, defects, where to meet up on campus..." /></Field>
      <Field id="f-photo" label="Photo (optional)">
        <input id="f-photo" type="file" accept="image/*" onChange={onPhoto} className="file" />
      </Field>
      {f.values.image && <img src={f.values.image} alt="Preview of your item" className="photo-prev" />}
      <button className="btn primary" type="submit">Post Listing</button>
    </Sheet>
  )
}
