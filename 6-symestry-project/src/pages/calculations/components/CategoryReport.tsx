import type { CSSProperties } from 'react'
import type { CategoryOption } from '../../../features/transactions/categories'
import type { TransactionType } from '../../../features/transactions/types'
import { formatMoney } from '../../../shared/formatMoney'
import './category-report.css'

type ReportCategory = CategoryOption & { amountMinorUnits: number }
type CategoryStyle = CSSProperties & { '--category-color': string }

type CategoryReportProps = {
  activeType: TransactionType
  categories: ReportCategory[]
  periodLabel: string
  activeTotal: number
  onTypeChange: (type: TransactionType) => void
}

export function CategoryReport({ activeType, categories, periodLabel, activeTotal, onTypeChange }: CategoryReportProps) {
  const chartCategories = categories.filter((category) => category.amountMinorUnits > 0)
  const maxAmount = Math.max(...categories.map((category) => category.amountMinorUnits), 1)
  const activeTypeLabel = activeType === 'expense' ? 'ВИТРАТИ' : 'ДОХОДИ'
  const nextType: TransactionType = activeType === 'expense' ? 'income' : 'expense'

  return (
    <>
      <section className={`report-categories report-categories--${activeType}`} aria-label="Витрати та доходи за категоріями">
        <div className="report-heading">
          <div className="report-type-switch" role="group" aria-label="Перемкнути витрати та доходи">
            <button type="button" aria-label={'Показати ' + (nextType === 'expense' ? 'витрати' : 'доходи')} onClick={() => onTypeChange(nextType)}>‹</button>
            <h1>{activeTypeLabel}</h1>
            <button type="button" aria-label={'Показати ' + (nextType === 'expense' ? 'витрати' : 'доходи')} onClick={() => onTypeChange(nextType)}>›</button>
          </div>
        </div>

        <div className="report-category-grid">
          {categories.map((category) => (
            <article className="report-category" key={category.id}>
              <strong className="report-category__amount">{formatMoney(category.amountMinorUnits)}</strong>
              <span className="report-category__icon" style={{ '--category-color': category.color } as CategoryStyle}>{category.icon}</span>
              <span className="report-category__label">{category.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={`report-chart-card report-chart-card--${activeType}`} aria-label={activeType === 'expense' ? 'Діаграма витрат' : 'Діаграма доходів'}>
        <div className="report-chart-card__heading">
          <div>
            <p className="panel-eyebrow">ДИНАМІКА ЗА МІСЯЦЬ</p>
            <h2>{activeType === 'expense' ? 'Витрати за категоріями' : 'Доходи за категоріями'}</h2>
          </div>
          <span>{periodLabel}</span>
        </div>
        {chartCategories.length === 0 ? (
          <div className="report-chart-empty">За цей місяць записів поки немає</div>
        ) : (
          <div className="report-chart" role="img" aria-label={'Розподіл за категоріями: ' + formatMoney(activeTotal)}>
            {chartCategories.map((category) => {
              const height = Math.max(7, (category.amountMinorUnits / maxAmount) * 100)
              return (
                <div className="report-chart__column" key={category.id}>
                  <span className="report-chart__value">{formatMoney(category.amountMinorUnits)}</span>
                  <div className="report-chart__track">
                    <span className={activeType === 'expense' ? 'report-chart__bar report-chart__bar--expense' : 'report-chart__bar report-chart__bar--income'} style={{ height: height + '%' }} />
                  </div>
                  <span className="report-chart__label">{category.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
