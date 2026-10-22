export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  type: TransactionType
  description: string
  categoryId: string
  amountMinorUnits: number
  currency: string
  occurredAt: string
  createdAt: string
}

// The server attaches the authenticated user's ID; the browser does not send it.
export type CreateTransactionInput = Pick<
  Transaction,
  'type' | 'description' | 'categoryId' | 'amountMinorUnits' | 'currency' | 'occurredAt'
>
