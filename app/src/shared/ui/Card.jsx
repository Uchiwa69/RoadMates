// Carte : surface claire (violette en sombre), rayon généreux, ombre chaude.
export default function Card({ as: Tag = 'div', interactive = false, className = '', ...props }) {
  return <Tag className={['ui-card', interactive && 'ui-card--interactive', className].filter(Boolean).join(' ')} {...props} />
}
