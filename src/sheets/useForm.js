import { useState } from 'react'

// Tiny form helper: values, a setter per field, and an errors object.
export function useForm(initial) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const bind = (key) => ({
    id: `f-${key}`,
    value: values[key],
    onChange: (e) => setValues((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })),
  })
  const validate = (rules) => {
    const errs = {}
    for (const [key, check] of Object.entries(rules)) {
      const msg = check(values[key], values)
      if (msg) errs[key] = msg
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }
  return { values, setValues, bind, errors, validate }
}

export const required = (msg) => (v) => (String(v ?? '').trim() ? null : msg)
