const LOGOUT_NOTICE_KEY = 'investiq-logout-notice'

// Writes a one-time notice to session storage.
export function saveLogoutNotice(message: string): void {
  try {
    sessionStorage.setItem(LOGOUT_NOTICE_KEY, message)
  } catch {
   
  }
}

// Reads the notice and removes it after use.
export function consumeLogoutNotice(): string | null {
  try {
    const message = sessionStorage.getItem(LOGOUT_NOTICE_KEY)
    sessionStorage.removeItem(LOGOUT_NOTICE_KEY)
    return message
  } catch {
    return null
  }
}
