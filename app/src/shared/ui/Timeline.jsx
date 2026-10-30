// Frise verticale des étapes d'un voyage.
export default function Timeline({ items }) {
  return (
    <ol className="ui-timeline">
      {items.map((it) => (
        <li key={it.key} className="ui-timeline__item">
          <span className="ui-timeline__point" aria-hidden="true" />
          <div className="ui-timeline__contenu">
            <span className="ui-timeline__titre">{it.titre}</span>
            {it.sousTitre && <span className="ui-timeline__sous">{it.sousTitre}</span>}
            {it.extra}
          </div>
        </li>
      ))}
    </ol>
  )
}
