// US-05 — les voyageurs dont l'itinéraire croise le mien, avant le départ.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Filter, MapPin, Route } from 'lucide-react'
import { updateDb, useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { Button, EmptyState, EntetePage } from '../../../shared/ui/index.js'
import { itinerairesCommuns } from '../matching.js'
import { formatPeriode } from '../dates.js'
import VoyageurCarte from '../VoyageurCarte.jsx'
import Filtres from '../Filtres.jsx'
import { appliquerFiltres, FILTRES_VIDES, normaliserFiltres } from '../filtres.js'

export default function Compagnons() {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const [filtres, setFiltresEtat] = useState(() => normaliserFiltres(user?.filtresDecouverte, user?.preferenceGenre))
  const setFiltres = (maj) => {
    const prochains = normaliserFiltres(typeof maj === 'function' ? maj(filtres) : maj, user?.preferenceGenre)
    setFiltresEtat(prochains)
    updateDb((base) => {
      const voyageur = base.users.find((candidat) => candidat.id === user?.id)
      if (voyageur) voyageur.filtresDecouverte = prochains
    })
  }
  const mesVoyages = db.trips.filter((t) => t.userId === user?.id)
  const langues = [...new Set(db.users.flatMap((u) => u.langues ?? []))].sort()
  const centresInteret = [...new Set(db.users.flatMap((u) => u.centresInteret ?? []))].sort()

  if (mesVoyages.length === 0) {
    return (
      <section>
        <EntetePage surtitre="Compagnons de route" titre="Itinéraires communs" />
        <EmptyState
          icon={Route}
          titre="Déclarez un voyage pour voir qui fait le même trajet que vous."
          action={<Button to={paths.nouveauVoyage}>Déclarer un voyage</Button>}
        />
      </section>
    )
  }

  const parVoyage = mesVoyages.map((voyage) => {
    const tous = itinerairesCommuns(db, voyage)
    return { voyage, tous, visibles: appliquerFiltres(tous, filtres, user) }
  })
  const total = parVoyage.reduce((s, v) => s + v.visibles.length, 0)

  return (
    <section className="compagnons">
      <EntetePage surtitre="Compagnons de route" titre="Itinéraires communs">
        <p>Les voyageurs qui partagent au moins une étape avec vous, le même jour au même endroit.</p>
      </EntetePage>
      <Button to={paths.monProfil} variant="secondaire">Compléter mon profil</Button>

      <Filtres filtres={filtres} setFiltres={setFiltres} langues={langues} centresInteret={centresInteret} total={total} preferenceGenre={user?.preferenceGenre} />

      {parVoyage.map(({ voyage, tous, visibles }) => (
        <section key={voyage.id} className="compagnons__voyage" aria-labelledby={`voyage-${voyage.id}`}>
          <div className="compagnons__voyage-tete">
            <h2 id={`voyage-${voyage.id}`}>{voyage.destination}</h2>
            <ul className="compagnons__etapes" aria-label={`Étapes de ${voyage.destination}`}>
              {voyage.etapes.map((e) => (
                <li key={`${e.ville}-${e.debut}`}>
                  <Link to={paths.destination(e.ville)} className="compagnons__etape">
                    <MapPin size={14} aria-hidden="true" />
                    {e.ville} <span className="compagnons__etape-dates">{formatPeriode(e)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {tous.length === 0 && (
            <EmptyState
              icon={Compass}
              titre="Aucun itinéraire commun pour l'instant"
              action={<Button to={paths.destination(voyage.etapes[0].ville)} variant="secondaire">Voir qui sera à {voyage.etapes[0].ville}</Button>}
            >
              <p>Personne ne fait encore le même trajet. Sur place, d'autres voyageurs seront peut-être dans la même ville.</p>
            </EmptyState>
          )}
          {tous.length > 0 && visibles.length === 0 && (
            <EmptyState
              icon={Filter}
              titre="Aucun voyageur ne correspond à ces filtres."
              action={<Button variant="secondaire" onClick={() => setFiltres({ ...FILTRES_VIDES, genre: user?.preferenceGenre ?? 'tous' })}>Réinitialiser les filtres</Button>}
            />
          )}

          <ul className="ui-grille">
            {visibles.map((r, i) => (
              <VoyageurCarte
                key={r.user.id}
                rang={i}
                resultat={r}
                score={{ valeur: r.compatibilite, total: 100 }}
                resume={`${r.nbEtapes} étape${r.nbEtapes > 1 ? 's' : ''} sur ${voyage.etapes.length} en commun · ${r.compatibilite}% de compatibilité`}
              />
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
