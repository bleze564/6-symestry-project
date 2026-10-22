import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { TransactionType } from './types'

const selectTransactions = (state: RootState) => state.transactions.items

export const selectTransactionsByType = createSelector(
  [selectTransactions, (_state: RootState, type: TransactionType) => type],
  (transactions, type) => transactions.filter((item) => item.type === type),
)

export const selectIncomeTotal = createSelector([selectTransactions], (transactions) =>
  transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amountMinorUnits, 0),
)

export const selectExpenseTotal = createSelector([selectTransactions], (transactions) =>
  transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amountMinorUnits, 0),
)

export const selectBalance = createSelector(
  [selectIncomeTotal, selectExpenseTotal],
  (income, expenses) => income - expenses,
)

export const selectMonthTotal = createSelector(
  [
    selectTransactions,
    (state: RootState) => state.summary.selectedMonth,
    (_state: RootState, type: TransactionType) => type,
  ],
  (transactions, selectedMonth, type) =>
    transactions
      .filter((item) => item.type === type && item.occurredAt.startsWith(selectedMonth))
      .reduce((total, item) => total + item.amountMinorUnits, 0),
)

export const selectCurrentYearSummary = createSelector(
  [selectTransactions, (state: RootState) => state.summary.currentYear],
  (transactions, year) =>
    Array.from({ length: 12 }, (_, index) => {
      const month = index + 1
      const monthPrefix = String(year) + '-' + String(month).padStart(2, '0')
      const monthTransactions = transactions.filter((item) =>
        item.occurredAt.startsWith(monthPrefix),
      )

      return {
        month,
        income: monthTransactions
          .filter((item) => item.type === 'income')
          .reduce((total, item) => total + item.amountMinorUnits, 0),
        expense: monthTransactions
          .filter((item) => item.type === 'expense')
          .reduce((total, item) => total + item.amountMinorUnits, 0),
      }
    }),
)

export const selectTransactionsByCategoryForMonth = createSelector(
  [
    selectTransactions,
    (state: RootState) => state.summary.selectedMonth,
    (_state: RootState, type: TransactionType) => type,
  ],
  (transactions, selectedMonth, type) => {
    const totals = new Map<string, number>()

    for (const transaction of transactions) {
      if (
        transaction.type === type &&
        transaction.occurredAt.startsWith(selectedMonth)
      ) {
        totals.set(
          transaction.categoryId,
          (totals.get(transaction.categoryId) ?? 0) + transaction.amountMinorUnits,
        )
      }
    }

    return Array.from(totals, ([categoryId, amountMinorUnits]) => ({
      categoryId,
      amountMinorUnits,
    })).sort((first, second) => second.amountMinorUnits - first.amountMinorUnits)
  },
)

