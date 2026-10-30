// Puce à bascule (filtres, langues). aria-pressed annonce l'état.
import { Check } from 'lucide-react'

export default function Chip({ actif = false, icon: Icon, children, className = '', ...props }) {
  return (
    <button type="button" aria-pressed={actif} className={['ui-chip', className].filter(Boolean).join(' ')} {...props}>
      {actif ? <Check size={16} aria-hidden="true" strokeWidth={2.5} /> : Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  )
}
