import { useState } from 'react'
import { useAppSelector } from '../../../../app/hooks'
import { formatMoney } from '../../../../shared/formatMoney'
import { selectCurrentYearSummary } from '../../../transactions/transactionsSelectors'
import type { TransactionType } from '../../../transactions/types'
import './monthly-summary.css'

const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']

export function MonthlySummary() {
  const [activeType, setActiveType] = useState<TransactionType>('expense')
  const summary = useAppSelector(selectCurrentYearSummary)
  const year = useAppSelector((state) => state.summary.currentYear)
  const lastSelectableMonth = useAppSelector((state) => state.summary.lastSelectableMonth)
  const months = summary.filter((item) => item.month <= lastSelectableMonth)

  return (
    <section className="panel summary-panel">
      <div className="summary-panel__heading">
        <div>
          <p className="panel-eyebrow">ЗВЕДЕННЯ</p>
          <h2>За {year} рік</h2>
        </div>
        <div className="summary-tabs" role="group" aria-label="Тип підсумку">
          <button type="button" className={activeType === 'expense' ? 'is-active' : ''} aria-pressed={activeType === 'expense'} onClick={() => setActiveType('expense')}>Витрати</button>
          <button type="button" className={activeType === 'income' ? 'is-active' : ''} aria-pressed={activeType === 'income'} onClick={() => setActiveType('income')}>Дохід</button>
        </div>
      </div>
      <div className="year-summary__list">
        {months.map((item) => (
          <div className="year-summary__row" key={item.month}>
            <span>{monthNames[item.month - 1]}</span>
            <strong>{formatMoney(item[activeType])}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}
