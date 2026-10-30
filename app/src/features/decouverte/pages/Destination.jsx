// Page d'une ville = page de résultats de la recherche « Où · Quand », tout au même endroit :
// voyageurs présents (US-04), choses à faire et bons plans des partenaires (US-18).
// - Avec ?du=…&au=… : recherche libre, sans voyage déclaré ; « Enregistrer ce voyage » le crée en un clic.
// - Sans dates : les dates de mon voyage dans cette ville, s'il existe.
// L'onglet est dans l'URL (?onglet=voyageurs|a-faire|bons-plans&carte=…).
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CalendarDays, Check, Globe2, MapPin, Search, Users } from 'lucide-react'
import { updateDb, useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { filtrerEtClasser } from '../../../shared/texte.js'
import { Button, Combobox, EmptyState, EntetePage, Field, TabPanel, Tabs, useToast } from '../../../shared/ui/index.js'
import { presentsDansLaVille, presentsDansLePays, presentsSurPeriode } from '../matching.js'
import { aujourdhui, formatPeriode, joursCommuns } from '../dates.js'
import { VILLES, trouverVille } from '../villes.js'
import { creerVoyage, validerVoyage } from '../voyages.js'
import VoyageurCarte from '../VoyageurCarte.jsx'
import Filtres from '../Filtres.jsx'
import ChampQuand from '../recherche/ChampQuand.jsx'
import { appliquerFiltres, FILTRES_VIDES, normaliserFiltres } from '../filtres.js'
import { RESUMES, activitesDe } from '../../partenaires/activites.js'
import { offresDeLaVille } from '../../partenaires/partenaires.js'
import { suggestionsContenus } from '../../partenaires/recherche.js'
import OngletAFaire from '../../partenaires/OngletAFaire.jsx'
import OngletBonsPlans from '../../partenaires/OngletBonsPlans.jsx'
import '../../partenaires/partenaires.css'

const ONGLETS = ['voyageurs', 'a-faire', 'bons-plans']
const ISO = /^\d{4}-\d{2}-\d{2}$/
const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`

function OngletVoyageurs({ ville, pays, etapes, recherche, trouver, voirActivites, dates }) {
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

  // Ni voyage ni dates : on demande les dates sur place, ou on crée le voyage.
  if (etapes.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        titre={`Quand serez-vous à ${ville} ?`}
        action={(
          <div className="destination__choix">
            {dates}
            <Button to={paths.nouveauVoyageVers(ville)} variant="secondaire">Créer un voyage à {ville}</Button>
            {voirActivites && <Button variant="fantome" onClick={voirActivites}>Voir ce qu’on peut y faire</Button>}
          </div>
        )}
      >
        <p>Choisissez vos dates pour voir qui sera là en même temps que vous. Rien n’est enregistré tant que vous ne le décidez pas.</p>
      </EmptyState>
    )
  }

  const langues = [...new Set(db.users.flatMap((u) => u.langues ?? []))].sort()
  const centresInteret = [...new Set(db.users.flatMap((u) => u.centresInteret ?? []))].sort()
  const tousDansLaVille = trouver()
  const dansLaVille = appliquerFiltres(tousDansLaVille, filtres, user)
  const tousDansLePays = elargi && pays ? trouver(pays) : []
  const dansLePays = appliquerFiltres(tousDansLePays.filter((r) => !tousDansLaVille.some((x) => x.user.id === r.user.id)), filtres, user)
  const n = dansLaVille.length

  return (
    <>
      <div className="destination__resume">
        <p>
          <CalendarDays size={18} aria-hidden="true" /> {recherche ? 'Votre recherche' : 'Vous y êtes'} :{' '}
          <strong>{etapes.map(formatPeriode).join(', ')}</strong>
        </p>
        <p aria-live="polite"><Users size={18} aria-hidden="true" /> <strong>{n}</strong> voyageur{n > 1 ? 's' : ''} {recherche ? 'sur ces dates' : 'en même temps que vous'}</p>
      </div>

      <Filtres filtres={filtres} setFiltres={setFiltres} langues={langues} centresInteret={centresInteret} total={n} preferenceGenre={user?.preferenceGenre} />

      {n === 0 && (
        <EmptyState
          icon={Users}
          titre={tousDansLaVille.length === 0 ? `Personne pour l'instant à ${ville} sur ces dates.` : 'Aucun voyageur ne correspond à ces filtres.'}
          action={tousDansLaVille.length > 0
            ? <Button variant="secondaire" onClick={() => setFiltres({ ...FILTRES_VIDES, genre: user?.preferenceGenre ?? 'tous' })}>Réinitialiser les filtres</Button>
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
          <h2 id="ailleurs">Ailleurs dans le pays ({pays}) {recherche ? 'sur ces dates' : 'pendant vos dates'}</h2>
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

// « Où ? » : une autre ville (les dates sont gardées), une activité ou un bon plan.
function ChampOu({ ville, du, au }) {
  const db = useDb((d) => d)
  const navigate = useNavigate()
  const [saisie, setSaisie] = useState('')
  const suggestions = saisie.trim().length < 2 ? [] : [
    ...filtrerEtClasser(VILLES, saisie, 'ville').slice(0, 4)
      .map((v) => ({ id: `v-${v.ville}`, groupe: 'Villes', label: v.ville, detail: v.pays, icon: MapPin, ville: v.ville })),
    ...suggestionsContenus(db, saisie),
  ]
  return (
    <Field label="Où ?" className="barre-recherche__ou">
      <Combobox
        valeur={saisie}
        onValeur={setSaisie}
        suggestions={suggestions}
        onChoix={(s) => {
          setSaisie('')
          navigate(s.onglet ? paths.destinationOnglet(s.ville, s.onglet, s.carte) : paths.destinationRecherche(s.ville, du, au))
        }}
        placeholder={`${ville} · autre ville, activité…`}
        vide="Aucun résultat."
        icon={Search}
      />
    </Field>
  )
}

export default function Destination() {
  const { ville } = useParams()
  const [params, setParams] = useSearchParams()
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const toast = useToast()
  const onglet = ONGLETS.includes(params.get('onglet')) ? params.get('onglet') : 'voyageurs'
  const carte = params.get('carte')

  // Modifie quelques paramètres de l'URL en gardant les autres (dates, onglet).
  const majParams = (changements) => setParams((actuels) => {
    const suivants = new URLSearchParams(actuels)
    for (const [cle, valeur] of Object.entries(changements)) {
      if (valeur) suivants.set(cle, valeur)
      else suivants.delete(cle)
    }
    return suivants
  }, { replace: true })

  const du = params.get('du')
  const au = params.get('au')
  const periode = du && au && ISO.test(du) && ISO.test(au) && du <= au ? { debut: du, fin: au } : null
  const infos = trouverVille(ville)
  const pays = infos?.pays ?? db.trips.flatMap((t) => t.etapes).find((e) => e.ville === ville)?.pays
  const mesEtapes = db.trips.filter((t) => t.userId === user?.id).flatMap((t) => t.etapes).filter((e) => e.ville === ville)
  const etapes = periode ? [{ ville, pays, ...periode }] : mesEtapes
  const trouver = (dansLePays) => (periode
    ? presentsSurPeriode(db, user?.id, ville, periode.debut, periode.fin, dansLePays)
    : dansLePays ? presentsDansLePays(db, user?.id, ville) : presentsDansLaVille(db, user?.id, ville))
  const dejaEnregistre = periode && mesEtapes.some((e) => joursCommuns(e, periode) > 0)

  const nbVoyageurs = etapes.length ? trouver().length : null
  const nbActivites = activitesDe(ville).length
  const nbOffres = offresDeLaVille(db, ville).length
  const compteurs = [
    nbVoyageurs != null && `${pluriel(nbVoyageurs, 'voyageur')} ${periode ? 'sur ces dates' : 'pendant vos dates'}`,
    nbActivites > 0 && pluriel(nbActivites, 'activité'),
    nbOffres > 0 && (nbOffres > 1 ? `${nbOffres} bons plans` : '1 bon plan'),
  ].filter(Boolean)

  // Le calendrier s'ouvre sur le mois où des voyageurs sont déjà annoncés dans cette ville.
  const today = aujourdhui()
  const moisSuggere = db.trips.flatMap((t) => t.etapes).filter((e) => e.ville === ville && e.fin >= today)
    .map((e) => e.debut).sort()[0]?.slice(0, 7)
  const champQuand = (
    <ChampQuand
      debut={periode?.debut}
      fin={periode?.fin}
      moisInitial={moisSuggere}
      onChange={({ debut, fin }) => majParams({ du: debut, au: fin, carte: null })}
    />
  )

  function enregistrer() {
    const { erreurs, etapes: propres } = validerVoyage({ destination: ville, etapes: [{ ville, ...periode }] })
    const erreur = Object.values(erreurs)[0]
    if (erreur) {
      toast(`Impossible d’enregistrer ce voyage : ${erreur.charAt(0).toLowerCase()}${erreur.slice(1)}`)
      return
    }
    creerVoyage(user.id, ville, propres)
    toast(`Voyage enregistré : les voyageurs de ${ville} peuvent maintenant vous trouver.`)
  }

  return (
    <section className="destination">
      <EntetePage surtitre={pays ? `Guide de ville · ${pays}` : 'Guide de ville'} titre={ville}>
        {RESUMES[ville] && <p>{RESUMES[ville]}</p>}
        {compteurs.length > 0 && <p className="destination__compteurs">{compteurs.join(' · ')}</p>}
      </EntetePage>

      <form className="barre-recherche" role="search" aria-label="Modifier la recherche" onSubmit={(e) => e.preventDefault()}>
        <ChampOu ville={ville} du={periode?.debut} au={periode?.fin} />
        <div className="barre-recherche__quand">{champQuand}</div>
      </form>

      <Tabs
        id="destination"
        label={`Guide de ${ville}`}
        valeur={onglet}
        onChange={(id) => majParams({ onglet: id, carte: null })}
        onglets={[
          { id: 'voyageurs', label: 'Voyageurs' },
          { id: 'a-faire', label: 'À faire' },
          { id: 'bons-plans', label: 'Bons plans', compte: nbOffres },
        ]}
      />
      <TabPanel id="destination" onglet={onglet}>
        {onglet === 'voyageurs' && (
          <OngletVoyageurs
            key={periode ? `${periode.debut}-${periode.fin}` : 'voyage'}
            ville={ville}
            pays={pays}
            etapes={etapes}
            recherche={Boolean(periode)}
            trouver={trouver}
            dates={champQuand}
            voirActivites={nbActivites > 0 ? () => majParams({ onglet: 'a-faire' }) : null}
          />
        )}
        {onglet === 'a-faire' && <OngletAFaire ville={ville} carte={carte} voyageurs={nbVoyageurs} />}
        {onglet === 'bons-plans' && <OngletBonsPlans ville={ville} pays={pays} carte={carte} />}
      </TabPanel>

      {periode && user && (
        <div className="enregistrer-voyage" role="region" aria-label="Enregistrer ce voyage">
          {dejaEnregistre ? (
            <p className="enregistrer-voyage__fait">
              <Check size={18} aria-hidden="true" /> Voyage enregistré à {ville}.{' '}
              <Link to={paths.mesVoyages}>Voir mes voyages</Link>
            </p>
          ) : (
            <>
              <p className="enregistrer-voyage__texte">
                <strong>{ville} · {formatPeriode(periode)}</strong>
                <span>Enregistrez ce voyage pour que les autres voyageurs vous trouvent aussi.</span>
              </p>
              <span className="enregistrer-voyage__actions">
                <Link to={paths.nouveauVoyageVers(ville, periode.debut, periode.fin)} className="enregistrer-voyage__etapes">Plusieurs étapes ?</Link>
                <Button onClick={enregistrer}>Enregistrer ce voyage</Button>
              </span>
            </>
          )}
        </div>
      )}
    </section>
  )
}
