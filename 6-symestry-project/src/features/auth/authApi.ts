import { apiRequest } from '../../shared/api/httpClient'
import type { AuthUser } from './authSlice'

export type AuthCredentials = {
  email: string
  password: string
}

export type AuthResponse = {
  user: AuthUser
}

export const authApi = {
  me: () => apiRequest<AuthResponse>('/auth/me'),

  login: (credentials: AuthCredentials) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (credentials: AuthCredentials) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: credentials,
    }),

  logout: () =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
    }),
}
