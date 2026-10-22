import type { CSSProperties } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { Button } from '../../../../components/ui'
import { formatMoney } from '../../../../shared/formatMoney'
import { getCategory } from '../../categories'
import { selectTransactionsByType } from '../../transactionsSelectors'
import { deleteTransaction } from '../../transactionsSlice'
import type { TransactionType } from '../../types'
import './transaction-table.css'

type CategoryStyle = CSSProperties & { '--category-color': string }
type TransactionTableProps = { type: TransactionType }

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day))
}

export function TransactionTable({ type }: TransactionTableProps) {
  const dispatch = useAppDispatch()
  const transactions = useAppSelector((state) => selectTransactionsByType(state, type))
  const requestError = useAppSelector((state) => state.transactions.error)
  const requestStatus = useAppSelector((state) => state.transactions.status)
  const sortedTransactions = [...transactions].sort((first, second) => second.occurredAt.localeCompare(first.occurredAt))

  if (requestStatus === 'loading') {
    return <p className="transaction-table__status" role="status">Завантажуємо операції…</p>
  }

  if (sortedTransactions.length === 0) {
    return (
      <>
      {requestError && <p className="transaction-table__error" role="alert">{requestError}</p>}
      <div className="transaction-empty">
        <span className="transaction-empty__icon" aria-hidden="true">{type === 'expense' ? '↘' : '↗'}</span>
        <p>Операцій поки немає</p>
        <span>Додайте перший запис за допомогою форми</span>
      </div>
      </>
    )
  }

  return (
    <div className="transaction-table-wrap">
      <table className="transaction-table">
        <thead><tr><th>Дата</th><th>Опис</th><th>Категорія</th><th className="transaction-table__amount-heading">Сума</th><th><span className="visually-hidden">Дія</span></th></tr></thead>
        <tbody>
          {sortedTransactions.map((transaction) => {
            const category = getCategory(transaction.categoryId)
            return (
              <tr key={transaction.id}>
                <td data-label="Дата">{formatDate(transaction.occurredAt)}</td>
                <td className="transaction-table__description" data-label="Опис">{transaction.description}</td>
                <td data-label="Категорія">
                  <span className="transaction-category">
                    <span className="transaction-category__icon" style={{ '--category-color': category.color } as CategoryStyle}>{category.icon}</span>
                    {category.label}
                  </span>
                </td>
                <td className={'transaction-table__amount transaction-table__amount--' + type} data-label="Сума">
                  {type === 'expense' ? '−' : '+'}{formatMoney(transaction.amountMinorUnits)}
                </td>
                <td className="transaction-table__delete-cell">
                  <Button className="transaction-table__delete" variant="gray" type="button" aria-label={'Видалити: ' + transaction.description} onClick={() => void dispatch(deleteTransaction(transaction.id))}>×</Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {requestError && <p className="transaction-table__error" role="alert">{requestError}</p>}
    </div>
  )
}
