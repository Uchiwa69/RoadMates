// Guide de ville : voyageurs présents pendant mes dates (US-04), choses à faire, et bons plans des
// partenaires (US-18). L'onglet est dans l'URL (?onglet=voyageurs|a-faire|bons-plans&carte=…).
// « À faire » et « Bons plans » restent consultables sans voyage déclaré.
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CalendarDays, Globe2, MapPin, Search, Users } from 'lucide-react'
import { updateDb, useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { filtrerEtClasser } from '../../../shared/texte.js'
import { Button, Combobox, EmptyState, EntetePage, Field, TabPanel, Tabs } from '../../../shared/ui/index.js'
import { presentsDansLaVille, presentsDansLePays } from '../matching.js'
import { formatPeriode } from '../dates.js'
import { VILLES, trouverVille } from '../villes.js'
import VoyageurCarte from '../VoyageurCarte.jsx'
import Filtres from '../Filtres.jsx'
import { appliquerFiltres, FILTRES_VIDES, normaliserFiltres } from '../filtres.js'
import { RESUMES, activitesDe } from '../../partenaires/activites.js'
import { offresDeLaVille } from '../../partenaires/partenaires.js'
import { suggestionsContenus } from '../../partenaires/recherche.js'
import OngletAFaire from '../../partenaires/OngletAFaire.jsx'
import OngletBonsPlans from '../../partenaires/OngletBonsPlans.jsx'
import '../../partenaires/partenaires.css'

const ONGLETS = ['voyageurs', 'a-faire', 'bons-plans']
const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`

function OngletVoyageurs({ ville, mesEtapes, voirActivites }) {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const [elargi, setElargi] = useState(false)
  const [filtres, setFiltresEtat] = useState(() => normaliserFiltres(user?.filtresDecouverte, user?.preferenceGenre))
  const setFiltres = (maj) => {
    const prochains = normaliserFiltres(typeof maj === 'function' ? maj(filtres) : maj, user?.preferenceGenre)
    setFiltresEtat(prochains)
    updateDb((base) => {
      const voyageur = base.users.find((candidat) => candidat.id === user?.id)
      if (voyageur) voyageur.filtresDecouverte = prochains
    })
  }

  if (mesEtapes.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        titre={`Vous n'avez pas de voyage déclaré à ${ville}.`}
        action={(
          <div className="destination__choix">
            <Button to={paths.nouveauVoyageVers(ville)}>Créer un voyage à {ville}</Button>
            {voirActivites && <Button variant="secondaire" onClick={voirActivites}>Voir ce qu’on peut y faire</Button>}
          </div>
        )}
      >
        <p>Déclarez vos dates pour voir qui sera là en même temps que vous.</p>
      </EmptyState>
    )
  }

  const langues = [...new Set(db.users.flatMap((u) => u.langues ?? []))].sort()
  const centresInteret = [...new Set(db.users.flatMap((u) => u.centresInteret ?? []))].sort()
  const dansLaVille = appliquerFiltres(presentsDansLaVille(db, user.id, ville), filtres, user)
  const tousDansLaVille = presentsDansLaVille(db, user.id, ville)
  const dansLePays = elargi ? appliquerFiltres(presentsDansLePays(db, user.id, ville), filtres, user) : []
  const tousDansLePays = elargi ? presentsDansLePays(db, user.id, ville) : []
  const pays = db.trips.flatMap((t) => t.etapes).find((e) => e.ville === ville)?.pays
  const n = dansLaVille.length

  return (
    <>
      <div className="destination__resume">
        <p><CalendarDays size={18} aria-hidden="true" /> Vous y êtes : <strong>{mesEtapes.map(formatPeriode).join(', ')}</strong></p>
        <p aria-live="polite"><Users size={18} aria-hidden="true" /> <strong>{n}</strong> voyageur{n > 1 ? 's' : ''} en même temps que vous</p>
      </div>

      <Filtres filtres={filtres} setFiltres={setFiltres} langues={langues} centresInteret={centresInteret} total={n} preferenceGenre={user?.preferenceGenre} />

      {n === 0 && (
        <EmptyState
          icon={Users}
          titre={tousDansLaVille.length === 0 ? `Personne pour l'instant à ${ville} sur ces dates.` : 'Aucun voyageur ne correspond à ces filtres.'}
          action={tousDansLaVille.length > 0
            ? <Button variant="secondaire" onClick={() => setFiltres({ ...FILTRES_VIDES, genre: user.preferenceGenre ?? 'tous' })}>Réinitialiser les filtres</Button>
            : !elargi && pays && <Button variant="secondaire" icon={Globe2} onClick={() => setElargi(true)}>Élargir à tout le pays ({pays})</Button>}
        >
          <p>{tousDansLaVille.length === 0 ? 'De nouveaux voyageurs déclarent leurs dates chaque jour.' : 'Modifiez ou réinitialisez vos critères de recherche.'}</p>
        </EmptyState>
      )}

      <h2 className="sr-only">Voyageurs présents à {ville}</h2>
      <ul className="ui-grille">
        {dansLaVille.map((r, i) => (
          <VoyageurCarte key={r.user.id} rang={i} resultat={r} resume={`${r.jours} jour${r.jours > 1 ? 's' : ''} en commun à ${ville}`} />
        ))}
      </ul>

      {elargi && (
        <section className="destination__pays" aria-labelledby="ailleurs">
          <h2 id="ailleurs">Ailleurs dans le pays ({pays}) pendant vos dates</h2>
          {dansLePays.length === 0
            ? <EmptyState icon={Globe2} titre={tousDansLePays.length === 0 ? 'Personne non plus dans le reste du pays.' : 'Aucun voyageur ne correspond à ces filtres.'} />
            : (
              <ul className="ui-grille">
                {dansLePays.map((r, i) => <VoyageurCarte key={r.user.id} rang={i} resultat={r} />)}
              </ul>
            )}
        </section>
      )}
    </>
  )
}

// Recherche groupée : une autre ville, une activité ou un bon plan.
function RechercheGuide() {
  const db = useDb((d) => d)
  const navigate = useNavigate()
  const [saisie, setSaisie] = useState('')
  const suggestions = saisie.trim().length < 2 ? [] : [
    ...filtrerEtClasser(VILLES, saisie, 'ville').slice(0, 4)
      .map((v) => ({ id: `v-${v.ville}`, groupe: 'Villes', label: v.ville, detail: v.pays, icon: MapPin, ville: v.ville })),
    ...suggestionsContenus(db, saisie),
  ]
  return (
    <form className="destination__recherche" role="search" onSubmit={(e) => e.preventDefault()}>
      <Field label="Chercher une ville, une activité, un bon plan">
        <Combobox
          valeur={saisie}
          onValeur={setSaisie}
          suggestions={suggestions}
          onChoix={(s) => {
            setSaisie('')
            navigate(s.onglet ? paths.destinationOnglet(s.ville, s.onglet, s.carte) : paths.destination(s.ville))
          }}
          placeholder="Lyon, musée, vélo…"
          vide="Aucun résultat."
          icon={Search}
        />
      </Field>
    </form>
  )
}

export default function Destination() {
  const { ville } = useParams()
  const [params, setParams] = useSearchParams()
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const onglet = ONGLETS.includes(params.get('onglet')) ? params.get('onglet') : 'voyageurs'
  const carte = params.get('carte')

  const mesEtapes = db.trips.filter((t) => t.userId === user?.id).flatMap((t) => t.etapes).filter((e) => e.ville === ville)
  const pays = trouverVille(ville)?.pays ?? db.trips.flatMap((t) => t.etapes).find((e) => e.ville === ville)?.pays
  const nbVoyageurs = mesEtapes.length ? presentsDansLaVille(db, user.id, ville).length : null
  const nbActivites = activitesDe(ville).length
  const nbOffres = offresDeLaVille(db, ville).length

  const compteurs = [
    nbVoyageurs != null && pluriel(nbVoyageurs, 'voyageur') + ' pendant vos dates',
    nbActivites > 0 && pluriel(nbActivites, 'activité'),
    nbOffres > 0 && (nbOffres > 1 ? `${nbOffres} bons plans` : '1 bon plan'),
  ].filter(Boolean)

  return (
    <section className="destination">
      <EntetePage surtitre={pays ? `Guide de ville · ${pays}` : 'Guide de ville'} titre={ville}>
        {RESUMES[ville] && <p>{RESUMES[ville]}</p>}
        {compteurs.length > 0 && <p className="destination__compteurs">{compteurs.join(' · ')}</p>}
      </EntetePage>

      <RechercheGuide />

      <Tabs
        id="destination"
        label={`Guide de ${ville}`}
        valeur={onglet}
        onChange={(id) => setParams({ onglet: id }, { replace: true })}
        onglets={[
          { id: 'voyageurs', label: 'Voyageurs' },
          { id: 'a-faire', label: 'À faire' },
          { id: 'bons-plans', label: 'Bons plans', compte: nbOffres },
        ]}
      />
      <TabPanel id="destination" onglet={onglet}>
        {onglet === 'voyageurs' && (
          <OngletVoyageurs
            ville={ville}
            mesEtapes={mesEtapes}
            voirActivites={nbActivites > 0 ? () => setParams({ onglet: 'a-faire' }, { replace: true }) : null}
          />
        )}
        {onglet === 'a-faire' && <OngletAFaire ville={ville} carte={carte} voyageurs={nbVoyageurs} />}
        {onglet === 'bons-plans' && <OngletBonsPlans ville={ville} pays={pays} carte={carte} />}
      </TabPanel>
    </section>
  )
}
