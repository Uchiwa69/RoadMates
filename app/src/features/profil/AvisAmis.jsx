// « Avis et amis de route » : avis mutuels (features/avis) et voyageurs ajoutés comme amis de route.
import { Link } from 'react-router-dom'
import { CalendarDays, UsersRound } from 'lucide-react'
import { useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Avatar, Card, EmptyState, EntetePage } from '../../shared/ui/index.js'
import AvisPage from '../avis/AvisPage.jsx'
import { formatPeriode } from '../decouverte/dates.js'
import RetourProfil from './RetourProfil.jsx'
import { amisVisibles, destinationsCommunes } from './amis.js'

function AmisDeRoute() {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const amis = user ? amisVisibles(db, user.id) : []
  const communes = user ? destinationsCommunes(db, user.id) : []

  return (
    <section aria-labelledby="amis-titre" className="amis">
      <h2 id="amis-titre">Amis de route</h2>
      <p className="amis__intro">Les voyageurs ajoutés après un parcours partagé, et vos prochaines destinations en commun.</p>
      {amis.length === 0 ? (
        <EmptyState icon={UsersRound} titre="Vous n’avez pas encore d’ami de route.">
          <p>Après un voyage, ajoutez vos compagnons depuis leur profil pour les retrouver ici.</p>
        </EmptyState>
      ) : (
        <ul className="amis__liste">
          {amis.map((ami) => (
            <li key={ami.id}>
              <Link to={paths.profil(ami.id)} className="amis__ami">
                <Avatar user={ami} taille={44} photo />
                <span>{ami.prenom}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {amis.length > 0 && (
        <Card className="amis__communes">
          <h3><CalendarDays size={18} aria-hidden="true" /> Destinations communes à venir</h3>
          {communes.length === 0 ? (
            <p>Aucun voyage commun à venir pour le moment.</p>
          ) : (
            <ul>
              {communes.map((c) => (
                <li key={`${c.amiId}-${c.ville}-${c.debut}`}>
                  <Link to={paths.destination(c.ville)}>{c.ville}</Link> avec {c.ami} · {formatPeriode(c)}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </section>
  )
}

export default function AvisAmis() {
  return (
    <section className="espace-profil espace-profil--etroit">
      <EntetePage avant={<RetourProfil page="Avis et amis de route" />} surtitre="Mon profil" titre="Avis et amis de route">
        <p>Les avis restent privés jusqu’à ce que les deux voyageurs se soient évalués.</p>
      </EntetePage>
      <AvisPage />
      <AmisDeRoute />
    </section>
  )
}
