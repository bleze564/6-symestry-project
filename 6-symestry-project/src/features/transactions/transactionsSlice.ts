import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userSignedOut } from '../auth/authSlice'
import { transactionsApi } from './transactionsApi'
import type { CreateTransactionInput, Transaction } from './types'

type TransactionsState = {
  items: Transaction[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const loadTransactions = createAsyncThunk('transactions/load', () =>
  transactionsApi.list(),
)

export const createTransaction = createAsyncThunk(
  'transactions/create',
  (input: CreateTransactionInput) => transactionsApi.create(input),
)

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string) => {
    await transactionsApi.remove(id)
    return id
  },
)

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(userSignedOut, () => initialState)
      .addCase(loadTransactions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'idle'
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Не вдалося завантажити операції.'
      })
      .addCase(createTransaction.pending, (state) => {
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не вдалося зберегти операцію.'
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.error.message ?? 'Не вдалося видалити операцію.'
      })
  },
})

export const transactionsReducer = transactionsSlice.reducer
