import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { DashboardHeader } from '../../components/layout/DashboardHeader'
import { AmbientBackground } from '../../components/layout/AmbientBackground'
import { saveLogoutNotice } from '../../features/auth/logoutNotice'
import { userSignedOut } from '../../features/auth/authSlice'
import { authApi } from '../../features/auth/authApi'
import { selectBalance, selectExpenseTotal, selectIncomeTotal } from '../../features/transactions/transactionsSelectors'
import { DashboardToolbar, TransactionWorkspace } from './components'
import './dashboard.css'

export function Dashboard() {
  const user = useAppSelector((state) => state.auth.user)
  const balance = useAppSelector(selectBalance)
  const income = useAppSelector(selectIncomeTotal)
  const expense = useAppSelector(selectExpenseTotal)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function handleLogout() {
    const notice = 'Ви вийшли з акаунта.'
    await authApi.logout().catch(() => undefined)
    saveLogoutNotice(notice)
    dispatch(userSignedOut())
    navigate('/login', { replace: true, state: { notice } })
  }

  if (!user) return null

  return (
    <div className="dashboard-page">
      <AmbientBackground />
      <DashboardHeader email={user.email} onLogout={handleLogout} />

      <main className="dashboard-main">
        <DashboardToolbar balance={balance} income={income} expense={expense} />
        <TransactionWorkspace />
      </main>
    </div>
  )
}
