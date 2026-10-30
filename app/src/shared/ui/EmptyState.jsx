// État vide illustré, qui propose toujours une suite (action).
export default function EmptyState({ icon: Icon, titre, children, action }) {
  return (
    <div className="ui-empty">
      {Icon && (
        <span className="ui-empty__icone" aria-hidden="true">
          <Icon size={28} />
        </span>
      )}
      <p className="ui-empty__titre">{titre}</p>
      {children && <div className="ui-empty__texte">{children}</div>}
      {action && <div className="ui-empty__action">{action}</div>}
    </div>
  )
}
