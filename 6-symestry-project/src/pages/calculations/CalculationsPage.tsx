import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { DashboardHeader } from '../../components/layout/DashboardHeader'
import { AmbientBackground } from '../../components/layout/AmbientBackground'
import { BalanceBadge } from '../../components/ui'
import { saveLogoutNotice } from '../../features/auth/logoutNotice'
import { userSignedOut } from '../../features/auth/authSlice'
import { authApi } from '../../features/auth/authApi'
import { categoriesByType } from '../../features/transactions/categories'
import { selectBalance, selectMonthTotal, selectTransactionsByCategoryForMonth } from '../../features/transactions/transactionsSelectors'
import type { TransactionType } from '../../features/transactions/types'
import { nextMonthSelected, previousMonthSelected } from '../../features/summary/summarySlice'
import { formatMoney } from '../../shared/formatMoney'
import { CategoryReport } from './components'
import './calculations.css'

function formatSelectedMonth(value: string): string {
  const [year, month] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

export function CalculationsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const balance = useAppSelector(selectBalance)
  const selectedMonth = useAppSelector((state) => state.summary.selectedMonth)
  const monthNumber = Number(selectedMonth.slice(-2))
  const lastSelectableMonth = useAppSelector((state) => state.summary.lastSelectableMonth)
  const [activeType, setActiveType] = useState<TransactionType>('expense')
  const totalIncome = useAppSelector((state) => selectMonthTotal(state, 'income'))
  const totalExpense = useAppSelector((state) => selectMonthTotal(state, 'expense'))
  const items = useAppSelector((state) => selectTransactionsByCategoryForMonth(state, activeType))
  const amounts = new Map(items.map((item) => [item.categoryId, item.amountMinorUnits]))
  const categories = categoriesByType[activeType].map((category) => ({
    ...category,
    amountMinorUnits: amounts.get(category.id) ?? 0,
  }))

  async function handleLogout() {
    const notice = 'Ви вийшли з акаунта.'
    await authApi.logout().catch(() => undefined)
    saveLogoutNotice(notice)
    dispatch(userSignedOut())
    navigate('/login', { replace: true, state: { notice } })
  }

  if (!user) return null

  return (
    <div className="dashboard-page calculations-page">
      <AmbientBackground />
      <DashboardHeader email={user.email} onLogout={handleLogout} />

      <main className="calculations-main">
        <div className="calculations-toolbar">
          <Link className="calculations-back" to="/dashboard"><span aria-hidden="true">←</span> Повернутися на головну</Link>
          <BalanceBadge amountMinorUnits={balance} />
          <div className="calculations-period">
            <span>Поточний період</span>
            <div className="month-switcher">
              <button type="button" aria-label="Попередній місяць" disabled={monthNumber <= 1} onClick={() => dispatch(previousMonthSelected())}>‹</button>
              <strong>{formatSelectedMonth(selectedMonth)}</strong>
              <button type="button" aria-label="Наступний місяць" disabled={monthNumber >= lastSelectableMonth} onClick={() => dispatch(nextMonthSelected())}>›</button>
            </div>
          </div>
        </div>

        <section className="calculations-totals" aria-label="Підсумок за місяць">
          <div><span>Витрати:</span><strong className="calculations-totals__expense">− {formatMoney(totalExpense)}</strong></div>
          <div><span>Доходи:</span><strong className="calculations-totals__income">+ {formatMoney(totalIncome)}</strong></div>
        </section>

        <CategoryReport
          activeType={activeType}
          categories={categories}
          periodLabel={formatSelectedMonth(selectedMonth)}
          activeTotal={activeType === 'expense' ? totalExpense : totalIncome}
          onTypeChange={setActiveType}
        />
      </main>
    </div>
  )
}
