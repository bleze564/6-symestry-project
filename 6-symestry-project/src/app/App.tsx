import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks'
import { Dashboard } from '../pages/dashboard/Dashboard'
import { AuthPage } from '../pages/auth/AuthPage'
import { CalculationsPage } from '../pages/calculations/CalculationsPage'
import { authApi } from '../features/auth/authApi'
import { sessionRestored } from '../features/auth/authSlice'
import { loadTransactions } from '../features/transactions/transactionsSlice'

function GuestOnly() {
  const user = useAppSelector((state) => state.auth.user)
  const initialized = useAppSelector((state) => state.auth.initialized)
  if (!initialized) return null
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />
}

function RequireAuth() {
  const user = useAppSelector((state) => state.auth.user)
  const initialized = useAppSelector((state) => state.auth.initialized)
  if (!initialized) return null
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.user?.id)

  useEffect(() => {
    let active = true
    authApi.me()
      .then(({ user }) => {
        if (active) dispatch(sessionRestored(user))
      })
      .catch(() => {
        if (active) dispatch(sessionRestored(null))
      })

    return () => { active = false }
  }, [dispatch])

  useEffect(() => {
    if (userId) void dispatch(loadTransactions())
  }, [dispatch, userId])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculations" element={<CalculationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
