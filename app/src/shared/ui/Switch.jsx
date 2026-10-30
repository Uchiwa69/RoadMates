// Interrupteur (motif ARIA switch) : un bouton dont aria-checked porte l'état.
// Nommé par `labelledBy` (id d'un titre visible) ou, à défaut, par `label`.
export default function Switch({ actif, onChange, label, labelledBy, describedBy, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={actif}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className={['ui-switch', className].filter(Boolean).join(' ')}
      onClick={() => onChange(!actif)}
    >
      <span className="ui-switch__piste" aria-hidden="true"><span className="ui-switch__pouce" /></span>
    </button>
  )
}
