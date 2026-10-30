// Avatar à initiale sur un dégradé propre à chaque voyageur (voir degrade.js).
// `photo` affiche la photo du voyageur s'il en a une : à réserver à l'utilisateur connecté
// ou à un profil visible (un profil anonyme ne doit jamais montrer sa photo).
import { degradeDe } from './degrade.js'

export default function Avatar({ user, taille = 48, className = '', photo = false }) {
  const source = photo ? user?.photo || user?.photoUrl : ''
  if (source) {
    return (
      <img
        className={['ui-avatar', 'ui-avatar--photo', className].filter(Boolean).join(' ')}
        style={{ '--taille': `${taille}px` }}
        src={source}
        alt=""
        referrerPolicy="no-referrer"
      />
    )
  }
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
