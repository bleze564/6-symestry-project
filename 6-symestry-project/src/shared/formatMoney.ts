export function formatMoney(amountMinorUnits: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(amountMinorUnits / 100)
}
