// Exemple chiffré : 240 € de voiture qui se divisent en 4 parts de 60 € à l'apparition.
// L'animation est décorative : le texte accessible donne le calcul complet.
import { useRef } from 'react'
import { useInView } from 'motion/react'
import { Car } from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { Avatar } from '../../../shared/ui/index.js'

const MEMBRES = ['u-lea', 'u-ines', 'u-sofia', 'u-karim']

export default function PartageVoiture() {
  const ref = useRef(null)
  const vu = useInView(ref, { once: true, amount: 0.6 })
  const users = useDb((db) => db.users)
  const membres = MEMBRES.map((id, i) => users.find((u) => u.id === id) ?? { id, prenom: '?' + i })

  return (
    <div ref={ref} className={`partage${vu ? ' partage--divise' : ''}`}>
      <p className="sr-only">Location de voiture : 240 € partagés entre 4 voyageurs, soit 60 € chacun.</p>
      <div className="partage__visuel" aria-hidden="true">
        <div className="partage__total">
          <span className="partage__icone"><Car size={22} /></span>
          <span>Location de voiture</span>
          <strong className="partage__montant">240 €</strong>
        </div>
        <div className="partage__barre">
          {membres.map((u, i) => (
            <div key={u.id} className="partage__part" style={{ '--i': i }}>
              <Avatar user={u} taille={36} />
              <span className="partage__prenom">{u.prenom}</span>
              <strong>60 €</strong>
            </div>
          ))}
        </div>
        <p className="partage__resultat">
          <strong>60 €</strong> chacun au lieu de 240 € seul
        </p>
      </div>
    </div>
  )
}
