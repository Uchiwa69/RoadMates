// Pastille de statut. Tons : neutre, succes, alerte, erreur, primaire, accent, violet.
export default function Badge({ ton = 'neutre', icon: Icon, className = '', children, ...props }) {
  return (
    <span className={['ui-badge', `ui-badge--${ton}`, className].filter(Boolean).join(' ')} {...props}>
      {Icon && <Icon size={14} aria-hidden="true" strokeWidth={2.5} />}
      {children}
    </span>
  )
}
