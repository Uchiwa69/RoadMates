// Choix d'une période : calendrier cliquable et utilisable au clavier, plus deux champs date natifs.
// Clavier : un seul jour est atteignable avec Tab ; flèches = jour / semaine, Page préc./suiv. = mois,
// Début / Fin = début / fin de semaine, Entrée ou Espace = choisir (1er choix : arrivée, 2e : départ).
import { useEffect, useId, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const JOURS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']
const fmtMois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const fmtJour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

const utc = (iso) => new Date(`${iso}T00:00:00Z`)
const versIso = (d) => d.toISOString().slice(0, 10)
const iso = (a, m, j) => `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`
const ajouterJours = (j, n) => versIso(new Date(utc(j).getTime() + n * 86400000))
const rangSemaine = (j) => (utc(j).getUTCDay() + 6) % 7 // lundi = 0

function decaler(mois, n) {
  const [a, m] = mois.split('-').map(Number)
  const d = new Date(Date.UTC(a, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function joursDuMois(mois) {
  const [a, m] = mois.split('-').map(Number)
  const premier = rangSemaine(iso(a, m, 1))
  const nb = new Date(Date.UTC(a, m, 0)).getUTCDate()
  return [...Array(premier).fill(null), ...Array.from({ length: nb }, (_, i) => iso(a, m, i + 1))]
}

// Même jour du mois suivant / précédent, borné au dernier jour du mois.
function jourDuMois(j, n) {
  const mois = decaler(j.slice(0, 7), n)
  const [a, m] = mois.split('-').map(Number)
  const nb = new Date(Date.UTC(a, m, 0)).getUTCDate()
  return iso(a, m, Math.min(Number(j.slice(8)), nb))
}

export default function PlageDates({ debut, fin, onChange, min, autres = [], moisInitial, erreur, labelDebut = 'Du', labelFin = 'Au' }) {
  const id = useId()
  const grille = useRef(null)
  const auClavier = useRef(false)
  const [mois, setMois] = useState(() => (debut || moisInitial || min || '2027-01-01').slice(0, 7))
  const [survol, setSurvol] = useState(null)
  const [focusJour, setFocusJour] = useState(debut || null)

  const jours = joursDuMois(mois)
  const choisissable = (j) => !min || j >= min
  // Le jour atteignable avec Tab : celui qui a le focus s'il est dans le mois affiché, sinon le premier choisissable.
  const tabulable = focusJour && focusJour.startsWith(mois) && choisissable(focusJour)
    ? focusJour
    : jours.find((j) => j && choisissable(j))

  useEffect(() => {
    if (!auClavier.current) return
    auClavier.current = false
    grille.current?.querySelector(`[data-jour="${focusJour}"]`)?.focus()
  }, [focusJour, mois])

  // 1er clic : début ; 2e clic : fin (ou nouveau début s'il est avant le premier).
  const choisir = (j) => {
    setFocusJour(j)
    if (!debut || fin) onChange({ debut: j, fin: '' })
    else if (j < debut) onChange({ debut: j, fin: '' })
    else onChange({ debut, fin: j })
  }

  const onKeyDown = (e, j) => {
    const cible = {
      ArrowLeft: () => ajouterJours(j, -1),
      ArrowRight: () => ajouterJours(j, 1),
      ArrowUp: () => ajouterJours(j, -7),
      ArrowDown: () => ajouterJours(j, 7),
      Home: () => ajouterJours(j, -rangSemaine(j)),
      End: () => ajouterJours(j, 6 - rangSemaine(j)),
      PageUp: () => jourDuMois(j, -1),
      PageDown: () => jourDuMois(j, 1),
    }[e.key]?.()
    if (!cible) return
    e.preventDefault()
    if (!choisissable(cible)) return
    auClavier.current = true
    setFocusJour(cible)
    setMois(cible.slice(0, 7))
  }

  const finVisuelle = fin || (debut && survol && survol >= debut ? survol : '')
  const etat = (j) => {
    const c = []
    if (!choisissable(j)) c.push('passe')
    if (j === debut) c.push('debut')
    if (j === finVisuelle) c.push('fin')
    if (debut && finVisuelle && j > debut && j < finVisuelle) c.push('dedans')
    if (autres.some((p) => p.debut && p.fin && j >= p.debut && j <= p.fin)) c.push('autre')
    return c
  }
  const etiquette = (j, c) => {
    const parties = [fmtJour.format(utc(j))]
    if (c.includes('debut')) parties.push('début de l’étape')
    if (j === fin) parties.push('fin de l’étape')
    else if (c.includes('dedans') && fin) parties.push('dans la période')
    if (c.includes('autre')) parties.push('déjà pris par une autre étape')
    return parties.join(', ')
  }

  return (
    <div className="ui-plage">
      <div className="ui-plage__champs">
        <div className="ui-field">
          <label className="ui-field__label" htmlFor={`${id}-debut`}>{labelDebut}</label>
          <input
            id={`${id}-debut`} type="date" className="ui-input" value={debut} min={min}
            aria-invalid={!!erreur || undefined} aria-describedby={erreur ? `${id}-err` : undefined}
            onChange={(e) => { onChange({ debut: e.target.value, fin }); if (e.target.value) setMois(e.target.value.slice(0, 7)) }}
          />
        </div>
        <div className="ui-field">
          <label className="ui-field__label" htmlFor={`${id}-fin`}>{labelFin}</label>
          <input
            id={`${id}-fin`} type="date" className="ui-input" value={fin} min={debut || min}
            aria-invalid={!!erreur || undefined} aria-describedby={erreur ? `${id}-err` : undefined}
            onChange={(e) => onChange({ debut, fin: e.target.value })}
          />
        </div>
      </div>

      <div className="ui-cal">
        <div className="ui-cal__tete">
          <button type="button" className="ui-cal__nav" aria-label="Mois précédent" onClick={() => setMois((m) => decaler(m, -1))}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <span className="ui-cal__mois" id={`${id}-mois`} aria-live="polite">{fmtMois.format(utc(`${mois}-01`))}</span>
          <button type="button" className="ui-cal__nav" aria-label="Mois suivant" onClick={() => setMois((m) => decaler(m, 1))}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" id={`${id}-aide`}>
          Flèches pour changer de jour, Page précédente et Page suivante pour changer de mois.
          Entrée choisit l’arrivée, puis le départ.
        </p>
        <div
          ref={grille}
          className="ui-cal__grille"
          role="group"
          aria-labelledby={`${id}-mois`}
          aria-describedby={`${id}-aide`}
          onMouseLeave={() => setSurvol(null)}
        >
          {JOURS.map((j) => <span key={j} className="ui-cal__entete" aria-hidden="true">{j.charAt(0).toUpperCase()}</span>)}
          {jours.map((j, i) => {
            if (!j) return <span key={`vide-${i}`} aria-hidden="true" />
            const c = etat(j)
            return (
              <button
                key={j}
                type="button"
                data-jour={j}
                tabIndex={j === tabulable ? 0 : -1}
                className={`ui-cal__jour ${c.map((x) => `ui-cal__jour--${x}`).join(' ')}`}
                disabled={!choisissable(j)}
                aria-label={etiquette(j, c)}
                aria-pressed={j === debut || j === fin}
                onClick={() => choisir(j)}
                onKeyDown={(e) => onKeyDown(e, j)}
                onFocus={() => setFocusJour(j)}
                onMouseEnter={() => setSurvol(j)}
              >
                {Number(j.slice(8))}
              </button>
            )
          })}
        </div>
        {autres.length > 0 && <p className="ui-cal__legende"><span className="ui-cal__pastille" aria-hidden="true" /> Vos autres étapes</p>}
      </div>

      {erreur && <p id={`${id}-err`} className="ui-field__erreur ui-plage__erreur">{erreur}</p>}
    </div>
  )
}
