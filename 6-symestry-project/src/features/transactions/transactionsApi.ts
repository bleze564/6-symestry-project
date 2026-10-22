import { apiRequest } from '../../shared/api/httpClient'
import type { CreateTransactionInput, Transaction } from './types'

export const transactionsApi = {
  list: () => apiRequest<Transaction[]>('/transactions'),

  create: (input: CreateTransactionInput) =>
    apiRequest<Transaction>('/transactions', { method: 'POST', body: input }),

  remove: (id: string) =>
    apiRequest<void>(`/transactions/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}
