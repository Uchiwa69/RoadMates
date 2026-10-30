// Avatar à initiale sur un dégradé propre à chaque voyageur (voir degrade.js).
import { degradeDe } from './degrade.js'

export default function Avatar({ user, taille = 48, className = '' }) {
  const initiale = (user?.prenom ?? '?').trim().charAt(0).toUpperCase()
  return (
    <span
      className={['ui-avatar', className].filter(Boolean).join(' ')}
      style={{ '--taille': `${taille}px`, background: degradeDe(user?.id) }}
      aria-hidden="true"
    >
      {initiale}
    </span>
  )
}
