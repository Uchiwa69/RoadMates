// Dates au format 'AAAA-MM-JJ', comparées en UTC pour éviter les décalages d'heure d'été.

const JOUR = 24 * 60 * 60 * 1000

const toTime = (iso) => Date.parse(`${iso}T00:00:00Z`)

export function aujourdhui() {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const jj = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${jj}`
}

// Nombre de jours communs entre deux périodes, bornes incluses (0 si aucun).
export function joursCommuns(a, b) {
  const debut = Math.max(toTime(a.debut), toTime(b.debut))
  const fin = Math.min(toTime(a.fin), toTime(b.fin))
  return fin < debut ? 0 : Math.round((fin - debut) / JOUR) + 1
}

// Période commune entre deux périodes, ou null.
export function periodeCommune(a, b) {
  if (!joursCommuns(a, b)) return null
  return {
    debut: a.debut > b.debut ? a.debut : b.debut,
    fin: a.fin < b.fin ? a.fin : b.fin,
  }
}

const fmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export function formatDate(iso) {
  return fmt.format(new Date(toTime(iso)))
}

export function formatPeriode({ debut, fin }) {
  return debut === fin ? formatDate(debut) : `${formatDate(debut)} → ${formatDate(fin)}`
}

export function ageDepuis(dateNaissance, ref = aujourdhui()) {
  const [a, m, j] = dateNaissance.split('-').map(Number)
  const [ra, rm, rj] = ref.split('-').map(Number)
  return ra - a - (rm < m || (rm === m && rj < j) ? 1 : 0)
}
