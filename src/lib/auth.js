import { EMAIL_DOMAIN, MIN_PASSWORD_LENGTH } from '../config'

// CLIENT-SIDE ONLY. This is for the prototype, not real security: anyone with
// access to the browser can read localStorage. Move all of this to the server
// (with proper hashing such as bcrypt/argon2) when the backend exists.

export async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function validateRegistration({ email, password, users }) {
  const errors = {}
  const e = email.trim().toLowerCase()
  if (!e) errors.email = 'Enter your TIP email.'
  else if (!new RegExp(`^[^\\s@]+@${EMAIL_DOMAIN.replace('.', '\\.')}$`).test(e))
    errors.email = `Use your @${EMAIL_DOMAIN} email address.`
  else if (users.some((u) => u.email === e)) errors.email = 'An account with this email already exists. Log in instead.'
  if (password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  return errors
}

// Placeholder for the student-number check. Later this will call the school's
// records to confirm the number belongs to the email that is registering.
export async function verifyStudentNumber(/* studentNumber, email */) {
  return { ok: true }
}
