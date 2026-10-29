// Anneau de correspondance : « 2 étapes sur 2 ». Décoratif : le texte voisin porte l'information.
export default function MatchRing({ valeur, total, taille = 56 }) {
  const r = 22
  const c = 2 * Math.PI * r
  const pct = total > 0 ? Math.min(valeur / total, 1) : 0
  return (
    <span className="ui-ring" style={{ '--taille': `${taille}px` }} aria-hidden="true">
      <svg viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} className="ui-ring__fond" />
        <circle cx="26" cy="26" r={r} className="ui-ring__valeur" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span className="ui-ring__texte">{valeur}/{total}</span>
    </span>
  )
}
