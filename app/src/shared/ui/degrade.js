// Dégradé propre à chaque voyageur, choisi à partir de son id.
// Les couleurs gardent un contraste ≥ 4,5:1 avec le blanc de l'initiale.
const DEGRADES = [
  ['#C2412F', '#B8245F'], ['#6B3FD1', '#B8245F'], ['#B03A28', '#8A4B00'], ['#5B33B8', '#2E2A8F'],
  ['#B8245F', '#6B3FD1'], ['#A5481A', '#C2412F'], ['#1A6E43', '#2E5E8C'], ['#8E2F7A', '#C2412F'],
]

function hash(s = '') {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

export function degradeDe(id) {
  const [a, b] = DEGRADES[hash(id) % DEGRADES.length]
  return `linear-gradient(135deg, ${a}, ${b})`
}
