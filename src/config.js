// App-wide switches. Flip these as real pieces come online.

// Only TIP emails can register.
export const EMAIL_DOMAIN = 'tip.edu.ph'
export const MIN_PASSWORD_LENGTH = 8

// When true, someone in the chat "replies" a moment after you send a message,
// so the demo feels alive. Turn off once real messaging exists.
export const SIMULATE_REPLIES = true

// Bump this whenever data/seed.js changes shape. Saved demo data with an older
// version is discarded and re-seeded.
export const DATA_VERSION = 3
