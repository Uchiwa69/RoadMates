// Barre de progression avec libellé visible (ex. « 3 parts payées sur 4 »), qui lui sert de nom accessible.
import { useId } from 'react'

export default function ProgressBar({ valeur, max, label, ton = 'primaire' }) {
  const id = useId()
  const pct = max > 0 ? Math.round((valeur / max) * 100) : 0
  return (
    <div className="ui-progress">
      {label && <span id={id} className="ui-progress__label">{label}</span>}
      <div
        className={`ui-progress__piste ui-progress--${ton}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={valeur}
        aria-valuetext={label}
        aria-labelledby={label ? id : undefined}
      >
        <div className="ui-progress__barre" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
