// Onglets accessibles (motif ARIA tablist) : flèches gauche/droite, Début, Fin.
import { useRef } from 'react'

export default function Tabs({ id, onglets, valeur, onChange, label }) {
  const refs = useRef([])
  const onKeyDown = (e, i) => {
    const n = onglets.length
    const cible = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key]
    if (cible === undefined) return
    e.preventDefault()
    onChange(onglets[cible].id)
    refs.current[cible]?.focus()
  }
  return (
    <div className="ui-tabs" role="tablist" aria-label={label}>
      {onglets.map((o, i) => {
        const actif = o.id === valeur
        return (
          <button
            key={o.id}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="tab"
            id={`${id}-tab-${o.id}`}
            aria-selected={actif}
            aria-controls={`${id}-panel-${o.id}`}
            tabIndex={actif ? 0 : -1}
            className="ui-tabs__tab"
            onClick={() => onChange(o.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {o.label}
            {o.compte > 0 && <span className="ui-tabs__compte">{o.compte}</span>}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ id, onglet, children }) {
  return (
    <div role="tabpanel" id={`${id}-panel-${onglet}`} aria-labelledby={`${id}-tab-${onglet}`} tabIndex={0} className="ui-tabpanel">
      {children}
    </div>
  )
}
