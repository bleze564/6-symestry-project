import { useState } from 'react'
import { MonthlySummary } from '../../../features/summary/components'
import { TransactionForm, TransactionTable } from '../../../features/transactions/components'
import type { TransactionType } from '../../../features/transactions/types'

export function TransactionWorkspace() {
  const [activeType, setActiveType] = useState<TransactionType>('expense')

  return (
    <section className={`workspace-panel workspace-panel--${activeType}`} aria-label="Облік фінансів">
      <div className="workspace-panel__operation-tabs" role="group" aria-label="Тип операції">
        <button type="button" className={activeType === 'expense' ? 'is-active' : ''} aria-pressed={activeType === 'expense'} onClick={() => setActiveType('expense')}>Витрати</button>
        <button type="button" className={activeType === 'income' ? 'is-active' : ''} aria-pressed={activeType === 'income'} onClick={() => setActiveType('income')}>Дохід</button>
      </div>

      <section className={`workspace-form workspace-form--${activeType}`} key={activeType} aria-label={activeType === 'expense' ? 'Нова витрата' : 'Новий дохід'}>
        <h1 className="visually-hidden">{activeType === 'expense' ? 'Додати витрату' : 'Додати дохід'}</h1>
        <TransactionForm type={activeType} />
      </section>

      <div className="workspace-content">
        <section className="transaction-history" key={activeType} aria-label={activeType === 'expense' ? 'Список витрат' : 'Список доходів'}>
          <div className="transaction-history__heading">
            <h2>{activeType === 'expense' ? 'Останні витрати' : 'Останні доходи'}</h2>
            <span>Нові записи зверху</span>
          </div>
          <TransactionTable type={activeType} />
        </section>

        <aside className="dashboard-sidebar" id="analytics" aria-label="Фінансова аналітика">
          <MonthlySummary />
        </aside>
      </div>
    </section>
  )
}
