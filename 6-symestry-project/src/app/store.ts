import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../features/auth/authSlice'
import { summaryReducer } from '../features/summary/summarySlice'
import { transactionsReducer } from '../features/transactions/transactionsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    summary: summaryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
