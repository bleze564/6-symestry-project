import { Link } from 'react-router-dom'
import './brand-logo.css'

type BrandLogoProps = {
  to: string
  className?: string
}

export function BrandLogo({ to, className = '' }: BrandLogoProps) {
  return (
    <Link className={['brand-logo', className].filter(Boolean).join(' ')} to={to}>
      <span className="brand-logo__shapes" aria-hidden="true">
        <span className="brand-logo__back" />
        <span className="brand-logo__front" />
      </span>
      <span className="brand-logo__wordmark">INVESTIQ</span>
    </Link>
  )
}
