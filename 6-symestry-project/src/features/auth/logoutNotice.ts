const LOGOUT_NOTICE_KEY = 'investiq-logout-notice'

export function saveLogoutNotice(message: string): void {
  try {
    sessionStorage.setItem(LOGOUT_NOTICE_KEY, message)
  } catch {
    // Router state still carries the notice when storage is unavailable.
  }
}

export function consumeLogoutNotice(): string | null {
  try {
    const message = sessionStorage.getItem(LOGOUT_NOTICE_KEY)
    sessionStorage.removeItem(LOGOUT_NOTICE_KEY)
    return message
  } catch {
    return null
  }
}
