import { formatMoney } from '../../../shared/formatMoney'
import './balance-badge.css'

type BalanceBadgeProps = { amountMinorUnits: number }

export function BalanceBadge({ amountMinorUnits }: BalanceBadgeProps) {
  return (
    <div className="balance-badge">
      <span>Баланс</span>
      <strong>{formatMoney(amountMinorUnits)}</strong>
    </div>
  )
}
