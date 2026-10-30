export function estBloque(db, userId, autreId) {
  return (db.blocages ?? []).some(({ bloqueurId, bloqueId }) =>
    (bloqueurId === userId && bloqueId === autreId) || (bloqueurId === autreId && bloqueId === userId),
  )
}
