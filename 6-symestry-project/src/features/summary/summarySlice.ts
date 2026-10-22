import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

function formatMonthKey(year: number, month: number): string {
  return String(year) + '-' + String(month).padStart(2, '0')
}

const today = new Date()
const currentYear = today.getFullYear()
const lastSelectableMonth = today.getMonth() + 1

type SummaryState = {
  currentYear: number
  lastSelectableMonth: number
  selectedMonth: string
}

const initialState: SummaryState = {
  currentYear,
  lastSelectableMonth,
  selectedMonth: formatMonthKey(currentYear, lastSelectableMonth),
}

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    monthSelected(state, action: PayloadAction<string>) {
      const match = /^(\d{4})-(\d{2})$/.exec(action.payload)
      if (!match) return

      const year = Number(match[1])
      const month = Number(match[2])

      if (
        year === state.currentYear &&
        month >= 1 &&
        month <= state.lastSelectableMonth
      ) {
        state.selectedMonth = action.payload
      }
    },
    previousMonthSelected(state) {
      const month = Number(state.selectedMonth.slice(-2))

      if (month > 1) {
        state.selectedMonth = formatMonthKey(state.currentYear, month - 1)
      }
    },
    nextMonthSelected(state) {
      const month = Number(state.selectedMonth.slice(-2))

      if (month < state.lastSelectableMonth) {
        state.selectedMonth = formatMonthKey(state.currentYear, month + 1)
      }
    },
  },
})

export const { monthSelected, previousMonthSelected, nextMonthSelected } =
  summarySlice.actions
export const summaryReducer = summarySlice.reducer
