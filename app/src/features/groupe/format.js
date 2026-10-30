// Mise en forme des dates et heures pour les pages de la partie B.
const jour = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const jourAnnee = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const heure = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })
const dateCourte = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })

const utc = (iso) => new Date(`${iso}T00:00:00Z`)

// '2027-07-10' → « 10 juil. »
export const formatJour = (iso) => (iso ? jour.format(utc(iso)) : '')
// '2027-07-01' → « 1 juillet 2027 »
export const formatJourLong = (iso) => (iso ? jourAnnee.format(utc(iso)) : '')
export const formatPeriode = (debut, fin) => (debut === fin ? formatJour(debut) : `${formatJour(debut)} → ${formatJour(fin)}`)

// Horodatage ISO → « aujourd'hui à 10:31 », sinon « le 29 oct. à 10:31 »
export function formatMoment(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const memeJour = d.toDateString() === new Date().toDateString()
  return memeJour ? `aujourd'hui à ${heure.format(d)}` : `le ${dateCourte.format(d)} à ${heure.format(d)}`
}

export function aujourdhuiIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
