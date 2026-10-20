import googleLogo from '../../assets/google-g-icon.svg'
import './google-mark.css'

export function GoogleMark() {
  return (
    <span className="google-mark" aria-hidden="true">
      <img src={googleLogo} alt="" />
    </span>
  )
}
