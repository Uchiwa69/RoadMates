// Photo de profil choisie sur l'appareil : redimensionnée dans le navigateur (rien n'est envoyé),
// puis gardée en data URL dans la base locale. Le localStorage est limité (~5 Mo) : on vise ≤ 60 Ko.
export const TAILLE_MAX_OCTETS = 60 * 1024

// Taille en octets de l'image contenue dans une data URL base64.
export function octetsDataUrl(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.floor((base64.length * 3) / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0)
}

function charger(fichier) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image illisible')) }
    img.src = url
  })
}

// Recadre au carré (centre), réduit à 256 px puis moins si besoin, en WebP (JPEG si non pris en charge).
export async function reduirePhoto(fichier) {
  if (!fichier?.type?.startsWith('image/')) throw new Error('Choisissez un fichier image.')
  const img = await charger(fichier)
  const cote = Math.min(img.naturalWidth, img.naturalHeight)
  const sx = (img.naturalWidth - cote) / 2
  const sy = (img.naturalHeight - cote) / 2
  for (const taille of [256, 200, 160]) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = Math.min(taille, cote)
    canvas.getContext('2d').drawImage(img, sx, sy, cote, cote, 0, 0, canvas.width, canvas.height)
    for (const qualite of [0.8, 0.7, 0.6]) {
      let dataUrl = canvas.toDataURL('image/webp', qualite)
      if (!dataUrl.startsWith('data:image/webp')) dataUrl = canvas.toDataURL('image/jpeg', qualite)
      if (octetsDataUrl(dataUrl) <= TAILLE_MAX_OCTETS) return dataUrl
    }
  }
  throw new Error('Cette image est trop lourde, même réduite. Essayez une autre photo.')
}
