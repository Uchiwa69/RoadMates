// Bouton : primaire, secondaire ou fantôme. Avec `to`, rend un lien du routeur.
import { Link } from 'react-router-dom'

export default function Button({
  variant = 'primaire', taille, to, loading = false, icon: Icon, iconEnd: IconEnd,
  className = '', children, disabled, type = 'button', ...props
}) {
  const classes = ['ui-btn', `ui-btn--${variant}`, taille && `ui-btn--${taille}`, className].filter(Boolean).join(' ')
  const contenu = (
    <>
      {loading ? <span className="ui-btn__spinner" aria-hidden="true" /> : Icon && <Icon size={18} aria-hidden="true" />}
      <span>{children}</span>
      {IconEnd && <IconEnd size={18} aria-hidden="true" />}
    </>
  )
  if (to) return <Link to={to} className={classes} {...props}>{contenu}</Link>
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {contenu}
    </button>
  )
}
