// US-02 + US-03 — déclarer un voyage et ses étapes, en trois temps : Où → Quand → Récapitulatif.
// validerVoyage (voyages.js) reste la seule source de vérité : chaque étape du parcours
// l'appelle et n'affiche que les erreurs qui la concernent.
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Check, MapPinned, UserPlus } from 'lucide-react'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { newId } from '../../../shared/db.js'
import GlobeTerre from '../../../shared/globe/Globe.jsx'
import { Button, Card, EmptyState, Field, Input, PlageDates, Stepper, Timeline, useToast } from '../../../shared/ui/index.js'
import { aujourdhui } from '../dates.js'
import { trouverVille } from '../villes.js'
import { validerVoyage, creerVoyage, MAX_ETAPES } from '../voyages.js'
import { periodeEnClair } from '../globe.js'
import DestinationPicker from '../voyage/DestinationPicker.jsx'
import '../voyage/voyage.css'

const PARCOURS = ['Où', 'Quand', 'Récapitulatif']
const etapeVide = (ville) => ({ cle: newId('e'), ville, debut: '', fin: '' })
const nbJours = (e) => Math.round((Date.parse(e.fin) - Date.parse(e.debut)) / 86400000) + 1
const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`

// Nom proposé tant que l'utilisateur n'a pas écrit le sien.
function nomPropose(etapes) {
  const infos = etapes.map((e) => trouverVille(e.ville)).filter(Boolean)
  if (infos.length === 0) return ''
  if (infos.length === 1) return infos[0].ville
  if (infos.every((v) => v.pays === infos[0].pays)) return infos[0].pays
  return `${infos[0].ville} → ${infos.at(-1).ville}`
}

export default function NouveauVoyage() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()
  const titre = useRef(null)
  // Arrivée depuis le globe de l'accueil : la ville est déjà choisie.
  const [params] = useSearchParams()
  const villeDemandee = params.get('ville') ?? ''
  const villeConnue = trouverVille(villeDemandee)

  const [pas, setPas] = useState(0)
  const [etapes, setEtapes] = useState(() => (villeConnue ? [etapeVide(villeConnue.ville)] : []))
  const [nomSaisi, setNomSaisi] = useState(null)
  const [erreurs, setErreurs] = useState({})
  const [recap, setRecap] = useState([])

  const destination = nomSaisi ?? nomPropose(etapes)

  // À chaque changement d'étape du parcours, le focus va sur son titre (lecteurs d'écran).
  const premierRendu = useRef(true)
  useEffect(() => {
    if (premierRendu.current) { premierRendu.current = false; return }
    titre.current?.focus()
  }, [pas])

  if (!user) {
    return (
      <EmptyState
        icon={UserPlus}
        titre="Créez un compte pour déclarer un voyage"
        action={<Button to={paths.inscription}>Créer un compte</Button>}
      >
        <p>Vos voyages permettent aux voyageurs qui vont au même endroit de vous trouver.</p>
      </EmptyState>
    )
  }

  const valider = () => validerVoyage({ destination, etapes })

  const ajouter = (v) => {
    setEtapes((es) => [...es, etapeVide(v.ville)])
    setErreurs((e) => ({ ...e, general: undefined }))
  }
  const retirer = (cle) => {
    setEtapes((es) => es.filter((e) => e.cle !== cle))
    setErreurs({})
  }
  const changerDates = (i, plage) => {
    setEtapes((es) => es.map((e, k) => (k === i ? { ...e, ...plage } : e)))
    setErreurs(({ [i]: _retiree, ...reste }) => reste)
  }

  // Où → Quand : on n'arrête que sur le nom, le nombre d'étapes et les villes inconnues.
  const versQuand = () => {
    const { erreurs: e } = valider()
    const bloquantes = Object.fromEntries(Object.entries(e).filter(([k, m]) =>
      k === 'destination' || k === 'general' || m === 'Aucune ville trouvée.'))
    setErreurs(bloquantes)
    if (Object.keys(bloquantes).length === 0) setPas(1)
  }

  // Quand → Récapitulatif : toutes les règles (dates passées, fin avant début, chevauchements).
  const versRecap = () => {
    const res = valider()
    setErreurs(res.erreurs)
    if (res.erreurs.destination || res.erreurs.general) return setPas(0)
    if (Object.keys(res.erreurs).length === 0) {
      setRecap(res.etapes)
      setPas(2)
    }
  }

  const enregistrer = () => {
    const res = valider()
    setErreurs(res.erreurs)
    if (Object.keys(res.erreurs).length) return setPas(res.erreurs.destination || res.erreurs.general ? 0 : 1)
    creerVoyage(user.id, destination, res.etapes)
    toast(`Voyage « ${destination.trim()} » enregistré.`)
    navigate(paths.mesVoyages)
  }

  const today = aujourdhui()
  const totalJours = recap.length ? nbJours({ debut: recap[0].debut, fin: recap.at(-1).fin }) : 0
  const infosRecap = recap.map((e) => trouverVille(e.ville)).filter(Boolean)

  return (
    <section className="nouveau">
      <header className="nouveau__entete">
        <h1>Déclarer un voyage</h1>
        <p className="nouveau__intro">Les voyageurs qui passent par les mêmes villes aux mêmes dates pourront vous trouver.</p>
        <Stepper etapes={PARCOURS} courante={pas} label="Étapes de la déclaration" />
      </header>

      {pas === 0 && (
        <div className="nouveau__pas">
          <h2 ref={titre} tabIndex={-1} className="nouveau__titre"><MapPinned size={22} aria-hidden="true" /> Où allez-vous ?</h2>
          <DestinationPicker
            etapes={etapes}
            onAjouter={ajouter}
            onRetirer={retirer}
            max={MAX_ETAPES}
            erreur={erreurs.general}
            saisieInitiale={villeConnue ? '' : villeDemandee}
          >
            <Card className="nouveau__nom">
              <Field label="Nom du voyage" aide="Proposé à partir de vos étapes : changez-le si vous voulez (ex. Algarve)." error={erreurs.destination}>
                <Input value={destination} onChange={(e) => { setNomSaisi(e.target.value); setErreurs((x) => ({ ...x, destination: undefined })) }} placeholder="Algarve" />
              </Field>
            </Card>
          </DestinationPicker>
          <div className="nouveau__actions">
            <Button onClick={versQuand} taille="grand" iconEnd={ArrowRight}>Choisir les dates</Button>
          </div>
        </div>
      )}

      {pas === 1 && (
        <div className="nouveau__pas">
          <h2 ref={titre} tabIndex={-1} className="nouveau__titre"><CalendarDays size={22} aria-hidden="true" /> Quand ?</h2>
          <p className="nouveau__aide">Cliquez le premier puis le dernier jour de chaque étape, ou saisissez les dates.</p>
          <ol className="nouveau__dates">
            {etapes.map((e, i) => {
              const precedente = etapes.slice(0, i).reverse().find((x) => x.fin || x.debut)
              return (
                <li key={e.cle}>
                  <Card as="fieldset" className="nouveau__etape">
                    <legend className="nouveau__legende">
                      <span className="picker__num" aria-hidden="true">{i + 1}</span>
                      Étape {i + 1} : {e.ville}
                      <span className="nouveau__legende-pays">{trouverVille(e.ville)?.pays}</span>
                    </legend>
                    <PlageDates
                      debut={e.debut}
                      fin={e.fin}
                      min={today}
                      moisInitial={precedente?.fin || precedente?.debut}
                      autres={etapes.filter((_, k) => k !== i)}
                      erreur={erreurs[i]}
                      onChange={(plage) => changerDates(i, plage)}
                    />
                  </Card>
                </li>
              )
            })}
          </ol>
          <div className="nouveau__actions">
            <Button variant="fantome" icon={ArrowLeft} onClick={() => setPas(0)}>Modifier les étapes</Button>
            <Button onClick={versRecap} taille="grand" iconEnd={ArrowRight}>Voir le récapitulatif</Button>
          </div>
        </div>
      )}

      {pas === 2 && (
        <div className="nouveau__pas nouveau__recap">
          <div className="nouveau__recap-texte">
            <h2 ref={titre} tabIndex={-1} className="nouveau__titre"><Check size={22} aria-hidden="true" /> Tout est bon ?</h2>
            <Card className="nouveau__resume">
              <p className="nouveau__resume-nom">{destination.trim()}</p>
              <p className="nouveau__resume-meta">
                {pluriel(recap.length, 'étape')} · {pluriel(totalJours, 'jour')} · {periodeEnClair(recap[0].debut, recap.at(-1).fin)}
              </p>
              <Timeline
                items={recap.map((e) => ({
                  key: `${e.ville}-${e.debut}`,
                  titre: e.ville,
                  sousTitre: `${e.pays} · ${periodeEnClair(e.debut, e.fin)} · ${pluriel(nbJours(e), 'jour')}`,
                }))}
              />
            </Card>
            <p className="nouveau__aide">Vous pourrez supprimer ce voyage à tout moment depuis « Mes voyages ».</p>
            <div className="nouveau__actions">
              <Button variant="fantome" icon={ArrowLeft} onClick={() => setPas(1)}>Modifier les dates</Button>
              <Button onClick={enregistrer} taille="grand" icon={Check}>Enregistrer mon voyage</Button>
            </div>
          </div>
          <div className="nouveau__recap-globe">
            <GlobeTerre
              label={`Itinéraire : ${recap.map((e) => e.ville).join(', ')}.`}
              points={infosRecap.map((v, i) => ({ ...v, nb: 1, texte: `Étape ${i + 1} : ${v.ville}` }))}
              arcs={infosRecap.slice(1).map((v, i) => ({ startLat: infosRecap[i].lat, startLng: infosRecap[i].lng, endLat: v.lat, endLng: v.lng }))}
              villes={infosRecap.map((v) => ({ ...v, nb: 0, actif: true }))}
              pays={infosRecap[0]?.iso ?? null}
              rotation={false}
            />
          </div>
        </div>
      )}
    </section>
  )
}
