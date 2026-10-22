import './ambient-background.css'

export function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <span className="ambient-background__orb ambient-background__orb--orange" />
      <span className="ambient-background__orb ambient-background__orb--violet" />
      <span className="ambient-background__orb ambient-background__orb--mint" />
    </div>
  )
}
