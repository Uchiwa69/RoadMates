import { aujourdhui } from '../decouverte/dates.js'

export function ontVoyageCommunTermine(voyagesA = [], voyagesB = [], dateActuelle = aujourdhui()) {
  return voyagesA.some((voyageA) => {
    if (!voyageA.etapes?.length || voyageA.etapes.some((etape) => etape.fin >= dateActuelle)) return false
    return voyagesB.some((voyageB) => {
      if (!voyageB.etapes?.length || voyageB.etapes.some((etape) => etape.fin >= dateActuelle)) return false
      return voyageA.etapes.some((etapeA) => voyageB.etapes.some((etapeB) => {
        if (etapeA.ville !== etapeB.ville) return false
        const debut = etapeA.debut > etapeB.debut ? etapeA.debut : etapeB.debut
        const fin = etapeA.fin < etapeB.fin ? etapeA.fin : etapeB.fin
        return debut <= fin
      }))
    })
  })
}

export function pairesAvisEligibles(db, userId, dateActuelle = aujourdhui()) {
  const eligibles = []
  for (const depense of db.expenses ?? []) {
    if (!depense.parts?.length || depense.parts.some((part) => !part.payee) || !depense.parts.some((part) => part.userId === userId && part.payee)) continue
    const groupe = (db.groups ?? []).find((candidat) => candidat.id === depense.groupId)
    if (!groupe?.membres?.includes(userId)) continue
    const personnes = [...new Set(groupe.membres)].filter((id) => id !== userId && depense.parts.some((part) => part.userId === id))
    for (const cibleId of personnes) {
      if (!db.users?.some((user) => user.id === userId) || !db.users?.some((user) => user.id === cibleId)) continue
      const voyagesMoi = (db.trips ?? []).filter((trip) => trip.userId === userId)
      const voyagesCible = (db.trips ?? []).filter((trip) => trip.userId === cibleId)
      if (!ontVoyageCommunTermine(voyagesMoi, voyagesCible, dateActuelle)) continue
      const demandeAcceptee = (db.requests ?? []).some((demande) => demande.statut === 'acceptee' && ((demande.fromId === userId && demande.toId === cibleId) || (demande.fromId === cibleId && demande.toId === userId)))
      if (!demandeAcceptee) continue
      const bloque = (db.blocages ?? []).some((blocage) => (blocage.bloqueurId === userId && blocage.bloqueId === cibleId) || (blocage.bloqueurId === cibleId && blocage.bloqueId === userId))
      if (bloque) continue
      if (!eligibles.some((avis) => avis.groupId === groupe.id && avis.cibleId === cibleId)) eligibles.push({ groupId: groupe.id, groupName: groupe.nom, cibleId })
    }
  }
  return eligibles
}

export function avisPublics(db, cibleId) {
  const tous = db.avis ?? []
  const reciproques = tous.filter((avis) =>
    avis.cibleId === cibleId && avis.auteurId !== cibleId &&
    Number.isInteger(avis.note) && avis.note >= 1 && avis.note <= 5 &&
    tous.some((autre) => autre.groupId === avis.groupId && autre.auteurId === avis.cibleId && autre.cibleId === avis.auteurId && Number.isInteger(autre.note) && autre.note >= 1 && autre.note <= 5),
  )
  return reciproques.map((avis) => ({
    ...avis,
    auteur: db.users?.find((user) => user.id === avis.auteurId)?.prenom ?? 'Voyageur',
  }))
}

export function moyenneAvis(avis) {
  if (!avis.length) return null
  return avis.reduce((somme, entree) => somme + entree.note, 0) / avis.length
}
