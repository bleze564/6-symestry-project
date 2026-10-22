import { Link } from 'react-router-dom'
import { BalanceBadge } from '../../../components/ui'
import { formatMoney } from '../../../shared/formatMoney'

type DashboardToolbarProps = {
  balance: number
  income: number
  expense: number
}

export function DashboardToolbar({ balance, income, expense }: DashboardToolbarProps) {
  return (
    <div className="dashboard-toolbar">
      <BalanceBadge amountMinorUnits={balance} />
      <div className="dashboard-toolbar__stats">
        <span className="dashboard-toolbar__stat dashboard-toolbar__stat--income">↗ <span>Доходи</span><strong>{formatMoney(income)}</strong></span>
        <span className="dashboard-toolbar__stat dashboard-toolbar__stat--expense">↘ <span>Витрати</span><strong>{formatMoney(expense)}</strong></span>
      </div>
      <Link className="dashboard-toolbar__analytics" to="/calculations">
        Перейти до розрахунків <span aria-hidden="true">▥</span>
      </Link>
    </div>
  )
}
