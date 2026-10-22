import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthUser = { id: string; email: string }

type AuthState = {
  user: AuthUser | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userSignedIn(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.initialized = true
    },
    userSignedOut(state) {
      state.user = null
      state.initialized = true
    },
    sessionRestored(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
      state.initialized = true
    },
  },
})

export const { userSignedIn, userSignedOut, sessionRestored } = authSlice.actions
export const authReducer = authSlice.reducer
