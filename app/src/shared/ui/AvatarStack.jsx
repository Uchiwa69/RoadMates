// Avatars empilés, avec « +N » au-delà de `max`. Le texte accessible liste les prénoms.
import Avatar from './Avatar.jsx'

export default function AvatarStack({ users, max = 4, taille = 36 }) {
  const visibles = users.slice(0, max)
  const reste = users.length - visibles.length
  return (
    <span className="ui-avatar-stack" style={{ '--taille': `${taille}px` }}>
      <span className="sr-only">{users.map((u) => u.prenom).join(', ')}</span>
      {visibles.map((u) => <Avatar key={u.id} user={u} taille={taille} />)}
      {reste > 0 && <span className="ui-avatar ui-avatar--reste" aria-hidden="true">+{reste}</span>}
    </span>
  )
}
