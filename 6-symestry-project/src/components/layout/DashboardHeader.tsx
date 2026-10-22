import { BrandLogo } from '../ui'
import './dashboard-header.css'

type DashboardHeaderProps = { email: string; onLogout: () => void }

export function DashboardHeader({ email, onLogout }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header__inner">
        <div className="dashboard-header__identity">
          <BrandLogo to="/dashboard" />
        </div>
        <div className="dashboard-header__user">
          <span className="dashboard-header__email">{email}</span>
          <button className="dashboard-header__logout" type="button" onClick={onLogout}>Вийти</button>
        </div>
      </div>
    </header>
  )
}
