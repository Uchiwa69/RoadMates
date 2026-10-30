// Progression d'un parcours en étapes (inscription, déclaration de voyage).
import { Check } from 'lucide-react'

export default function Stepper({ etapes, courante, label = 'Progression' }) {
  return (
    <ol className="ui-stepper" aria-label={label}>
      {etapes.map((e, i) => {
        const etat = i < courante ? 'faite' : i === courante ? 'courante' : 'a-venir'
        return (
          <li key={e} className={`ui-stepper__etape ui-stepper__etape--${etat}`} aria-current={i === courante ? 'step' : undefined}>
            <span className="ui-stepper__label">
              {etat === 'faite' && <Check size={14} strokeWidth={3} aria-hidden="true" />}
              <span className="sr-only">Étape {i + 1} : </span>{e}
              {etat === 'faite' && <span className="sr-only"> (terminée)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
