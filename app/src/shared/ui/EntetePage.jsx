// En-tête commun des pages : surtitre, titre (h1), description et actions.
export default function EntetePage({ surtitre, titre, children, actions, avant }) {
  return (
    <header className="ui-page-tete">
      {avant}
      <div className="ui-page-tete__ligne">
        <div className="ui-page-tete__texte">
          {surtitre && <p className="ui-page-tete__surtitre">{surtitre}</p>}
          <h1 className="ui-page-tete__titre">{titre}</h1>
          {children && <div className="ui-page-tete__desc">{children}</div>}
        </div>
        {actions && <div className="ui-page-tete__actions">{actions}</div>}
      </div>
    </header>
  )
}
