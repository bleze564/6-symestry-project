import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AccountWindow } from '../../features/auth/components'
import { consumeLogoutNotice } from '../../features/auth/logoutNotice'
import { BrandLogo } from '../../components/ui'
import './auth-page.css'

type AuthPageProps = { mode: 'login' | 'register' }

export function AuthPage({ mode }: AuthPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const routeNotice = (location.state as { notice?: string } | null)?.notice
  const [flashNotice] = useState(consumeLogoutNotice)
  const notice = routeNotice ?? flashNotice

  useEffect(() => {
    if (!notice) return
    const timeoutId = window.setTimeout(() => navigate(location.pathname, { replace: true, state: null }), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [location.pathname, navigate, notice])

  return (
    <div className="auth-page">
      <header className="auth-header">
        <BrandLogo className="auth-header__brand" to="/login" />
        <span className="auth-header__caption">РОЗУМНІ ФІНАНСИ</span>
      </header>
      {notice && <div className="auth-notice" role="status">{notice}</div>}
      <main className="auth-scene">
        <div className="auth-layout">
          <section className="auth-brand" aria-label="InvestIQ — розумні фінанси">
            <p className="auth-brand__name">InvestIQ</p>
            <p className="auth-brand__tagline">РОЗУМНІ ФІНАНСИ</p>
          </section>
          <AccountWindow key={mode} mode={mode} />
        </div>
      </main>
    </div>
  )
}
