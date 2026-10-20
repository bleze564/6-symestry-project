import { Link } from 'react-router-dom'
import { AccountWindow } from '../../components/account/AccountWindow'
import './auth-page.css'

type AuthPageProps = {
  mode: 'login' | 'register'
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link className="auth-header__brand" to="/login" aria-label="InvestIQ — на сторінку входу">
          <span className="auth-header__mark" aria-hidden="true">
            <span className="auth-header__mark-back" />
            <span className="auth-header__mark-front" />
          </span>
          <span className="auth-header__wordmark">INVESTIQ</span>
        </Link>
        <Link className="auth-header__gallery" to="/buttons">Галерея кнопок</Link>
      </header>

      <main className="auth-scene">
        <div className="auth-layout">
          <section className="auth-brand" aria-label="InvestIQ Smart Finance">
            <p className="auth-brand__name">InvestIQ</p>
            <p className="auth-brand__tagline">SMART FINANCE</p>
          </section>

          <AccountWindow key={mode} mode={mode} />
        </div>
      </main>
    </div>
  )
}
