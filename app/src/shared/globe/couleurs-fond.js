// Remplace la bibliothèque « polished » au build (voir vite.config.js) : three-render-objects
// ne s'en sert que pour lire la couleur de fond du globe (parseToRgb) et la rendre opaque
// (opacify). Ces deux fonctions suffisent pour les formats hex, rgb() et rgba().

export function parseToRgb(couleur) {
  const c = String(couleur).trim()
  const hex = c.match(/^#([\da-f]{3,8})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length <= 4) h = [...h].map((x) => x + x).join('')
    const n = (i) => parseInt(h.slice(i, i + 2), 16)
    return { red: n(0), green: n(2), blue: n(4), alpha: h.length === 8 ? n(6) / 255 : 1 }
  }
  const fn = c.match(/^rgba?\(([^)]+)\)$/i)
  if (fn) {
    const [r, g, b, a = '1'] = fn[1].split(/[\s,/]+/).filter(Boolean)
    return { red: Number(r), green: Number(g), blue: Number(b), alpha: Number(a) }
  }
  throw new Error(`Couleur de fond non prise en charge : ${couleur}`)
}

// three-render-objects n'appelle que opacify(1, couleur) : on renvoie la couleur opaque.
export function opacify(_quantite, couleur) {
  const { red, green, blue } = parseToRgb(couleur)
  return `rgb(${red}, ${green}, ${blue})`
}
