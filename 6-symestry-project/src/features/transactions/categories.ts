import type { TransactionType } from './types'

export type CategoryOption = { id: string; label: string; icon: string; color: string }

export const categoriesByType: Record<TransactionType, CategoryOption[]> = {
  expense: [
    { id: 'food', label: 'Продукти', icon: '🍓', color: '#ff8b54' },
    { id: 'transport', label: 'Транспорт', icon: '🚗', color: '#6b8ef2' },
    { id: 'housing', label: 'Житло', icon: '🏠', color: '#9a7be8' },
    { id: 'health', label: 'Здоров’я', icon: '💊', color: '#ec6681' },
    { id: 'shopping', label: 'Покупки', icon: '🛍️', color: '#e7b644' },
    { id: 'leisure', label: 'Відпочинок', icon: '🎟️', color: '#44b7a7' },
    { id: 'other-expense', label: 'Інше', icon: '•••', color: '#87909f' },
  ],
  income: [
    { id: 'salary', label: 'Зарплата', icon: '💼', color: '#48aa79' },
    { id: 'freelance', label: 'Фріланс', icon: '💻', color: '#6b8ef2' },
    { id: 'gift', label: 'Подарунок', icon: '🎁', color: '#e77caa' },
    { id: 'other-income', label: 'Інше', icon: '•••', color: '#87909f' },
  ],
}

export function getCategory(categoryId: string): CategoryOption {
  return Object.values(categoriesByType).flat().find((category) => category.id === categoryId) ?? {
    id: categoryId,
    label: 'Інше',
    icon: '•••',
    color: '#87909f',
  }
}
