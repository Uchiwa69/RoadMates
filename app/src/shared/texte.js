// Comparaison de saisies sans accents ni majuscules (« seville » trouve « Séville »).
export function normaliser(s) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function echapperHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}
