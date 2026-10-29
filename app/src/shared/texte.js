// Comparaison de saisies sans accents ni majuscules (« seville » trouve « Séville »).
export function normaliser(s) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function echapperHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// Garde les éléments dont `cle` contient la saisie, ceux qui commencent par elle en premier.
export function filtrerEtClasser(liste, saisie, cle) {
  const q = normaliser(saisie)
  if (!q) return []
  return liste
    .filter((x) => normaliser(x[cle]).includes(q))
    .sort((a, b) => Number(normaliser(b[cle]).startsWith(q)) - Number(normaliser(a[cle]).startsWith(q)))
}
