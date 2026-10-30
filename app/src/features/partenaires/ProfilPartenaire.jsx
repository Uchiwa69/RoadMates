// Profil de l'établissement partenaire incarné dans le mode démo.
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Clock, LogOut, Store } from 'lucide-react'
import { useDb } from '../../shared/db.js'
import { setCurrentUser, usePartenaire } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Avatar, Badge, Button, Card, EmptyState, EntetePage } from '../../shared/ui/index.js'
import { CATEGORIES_PARTENAIRE } from './partenaires.js'

export default function ProfilPartenaire() {
  const partenaire = usePartenaire()
  const voyageurId = useDb((db) => db.session.userId)
  const navigate = useNavigate()

  if (!partenaire) {
    return (
      <section>
        <h1 className="sr-only">Profil partenaire</h1>
        <EmptyState icon={Store} titre="Espace réservé aux partenaires" />
      </section>
    )
  }

  return (
    <section className="espace-partenaire espace-partenaire--etroit">
      <EntetePage surtitre="Espace partenaire" titre="Profil de l’établissement" />
      <Card className="espace-partenaire__profil">
        <Avatar user={{ id: partenaire.id, prenom: partenaire.nom }} taille={72} />
        <div>
          <h2>{partenaire.nom}</h2>
          <p>{CATEGORIES_PARTENAIRE[partenaire.categorie]} · {partenaire.ville}</p>
          {partenaire.valide
            ? <Badge ton="succes" icon={BadgeCheck}>Partenaire validé</Badge>
            : <Badge ton="alerte" icon={Clock}>Compte en cours de validation</Badge>}
        </div>
        <p className="espace-partenaire__description">{partenaire.description}</p>
        <p className="espace-partenaire__note">Établissement fictif — données de démonstration. Dans le produit, la validation suit la vérification de l’établissement par l’équipe RoadMates.</p>
      </Card>
      <Button variant="secondaire" icon={LogOut} onClick={() => { setCurrentUser(voyageurId); navigate(paths.accueil) }}>
        Revenir au mode voyageur
      </Button>
    </section>
  )
}
