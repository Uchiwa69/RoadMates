// Choix d'une période : calendrier cliquable + deux champs date natifs.
// Les champs natifs restent la voie accessible (clavier, lecteur d'écran) ; le calendrier
// est un raccourci visuel pour la souris et le doigt, masqué aux technologies d'assistance.
import { useId, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const JOURS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.']
const fmtMois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })

const iso = (a, m, j) => `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`
function decaler(mois, n) {
  const [a, m] = mois.split('-').map(Number)
  const d = new Date(Date.UTC(a, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function joursDuMois(mois) {
  const [a, m] = mois.split('-').map(Number)
  const premier = (new Date(Date.UTC(a, m - 1, 1)).getUTCDay() + 6) % 7 // lundi = 0
  const nb = new Date(Date.UTC(a, m, 0)).getUTCDate()
  return [...Array(premier).fill(null), ...Array.from({ length: nb }, (_, i) => iso(a, m, i + 1))]
}

export default function PlageDates({ debut, fin, onChange, min, autres = [], moisInitial, erreur, labelDebut = 'Du', labelFin = 'Au' }) {
  const id = useId()
  const [mois, setMois] = useState(() => (debut || moisInitial || min || '2027-01-01').slice(0, 7))
  const [survol, setSurvol] = useState(null)

  // 1er clic : début ; 2e clic : fin (ou nouveau début s'il est avant le premier).
  const cliquer = (j) => {
    if (!debut || fin) onChange({ debut: j, fin: '' })
    else if (j < debut) onChange({ debut: j, fin: '' })
    else onChange({ debut, fin: j })
  }

  const finVisuelle = fin || (debut && survol && survol >= debut ? survol : '')
  const etat = (j) => {
    const c = []
    if (min && j < min) c.push('passe')
    if (j === debut) c.push('debut')
    if (j === finVisuelle) c.push('fin')
    if (debut && finVisuelle && j > debut && j < finVisuelle) c.push('dedans')
    if (autres.some((p) => p.debut && p.fin && j >= p.debut && j <= p.fin)) c.push('autre')
    return c.map((x) => `ui-cal__jour--${x}`).join(' ')
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

      <div className="ui-cal" aria-hidden="true">
        <div className="ui-cal__tete">
          <button type="button" tabIndex={-1} className="ui-cal__nav" onClick={() => setMois((m) => decaler(m, -1))}>
            <ChevronLeft size={18} />
          </button>
          <span className="ui-cal__mois">{fmtMois.format(new Date(`${mois}-01T00:00:00Z`))}</span>
          <button type="button" tabIndex={-1} className="ui-cal__nav" onClick={() => setMois((m) => decaler(m, 1))}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="ui-cal__grille" onMouseLeave={() => setSurvol(null)}>
          {JOURS.map((j) => <span key={j} className="ui-cal__entete">{j.charAt(0).toUpperCase()}</span>)}
          {joursDuMois(mois).map((j, i) => (j ? (
            <button
              key={j} type="button" tabIndex={-1}
              className={`ui-cal__jour ${etat(j)}`}
              disabled={!!min && j < min}
              onClick={() => cliquer(j)}
              onMouseEnter={() => setSurvol(j)}
            >
              {Number(j.slice(8))}
            </button>
          ) : <span key={`vide-${i}`} />))}
        </div>
        {autres.length > 0 && <p className="ui-cal__legende"><span className="ui-cal__pastille" /> Vos autres étapes</p>}
      </div>

      {erreur && <p id={`${id}-err`} className="ui-field__erreur ui-plage__erreur">{erreur}</p>}
    </div>
  )
}
