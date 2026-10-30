// Compte et données : export (portabilité, RGPD art. 20) et suppression locale du compte.

// Tout ce qui concerne l'utilisateur, dans un objet prêt à être enregistré en JSON.
// Les messages restent chiffrés tels qu'ils sont stockés : la clé ne quitte pas l'appareil.
export function exporterDonnees(db, userId, maintenant = new Date()) {
  const groupes = db.groups.filter((g) => g.membres.includes(userId))
  const idsGroupes = new Set(groupes.map((g) => g.id))
  return {
    application: 'RoadMates (prototype de démonstration)',
    exporteLe: maintenant.toISOString(),
    profil: db.users.find((u) => u.id === userId) ?? null,
    voyages: db.trips.filter((t) => t.userId === userId),
    demandes: db.requests.filter((r) => r.fromId === userId || r.toId === userId),
    groupes,
    messagesEnvoyes: db.messages.filter((m) => m.auteurId === userId && idsGroupes.has(m.groupId)),
    depenses: (db.expenses ?? []).filter((e) => e.createurId === userId || e.parts.some((p) => p.userId === userId)),
    avisDonnes: (db.avis ?? []).filter((a) => a.auteurId === userId),
    avisRecus: (db.avis ?? []).filter((a) => a.cibleId === userId),
    blocages: (db.blocages ?? []).filter((b) => b.bloqueurId === userId),
    signalements: (db.signalements ?? []).filter((s) => s.auteurId === userId),
  }
}

// Supprime le compte de la base de démonstration (à appeler dans updateDb).
// Les références nécessaires aux groupes et aux dépenses des autres passent sur un compte anonyme.
export function supprimerCompte(db, userId, idAnonyme) {
  const comptesRestants = db.users.filter((candidate) => candidate.id !== userId)
  db.users = [...comptesRestants, {
    id: idAnonyme,
    prenom: 'Voyageur supprimé',
    age: null,
    genre: 'autre',
    langues: [],
    bio: '',
    verifie: false,
    photoUrl: '',
  }]
  db.trips = db.trips.filter((trip) => trip.userId !== userId)
  db.requests = db.requests.filter((request) => request.fromId !== userId && request.toId !== userId)
  db.groups.forEach((group) => {
    group.membres = [...new Set(group.membres.map((memberId) => memberId === userId ? idAnonyme : memberId))]
  })
  db.messages = db.messages.filter((message) => message.auteurId !== userId)
  ;(db.expenses ?? []).forEach((expense) => {
    if (expense.createurId === userId) expense.createurId = idAnonyme
    expense.parts.forEach((part) => {
      if (part.userId === userId) part.userId = idAnonyme
    })
  })
  db.blocages = (db.blocages ?? []).filter((item) => item.bloqueurId !== userId && item.bloqueId !== userId)
  db.signalements = (db.signalements ?? []).filter((item) => item.auteurId !== userId && item.cibleId !== userId)
  db.avis = (db.avis ?? []).filter((item) => item.auteurId !== userId).map((item) => ({
    ...item,
    cibleId: item.cibleId === userId ? idAnonyme : item.cibleId,
  }))
  db.session.userId = comptesRestants[0]?.id ?? null
}
