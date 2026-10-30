const PREFIXE_CLE = 'roadmates-cle-groupe-v1:'
const cles = new Map()

function encoderBase64(bytes) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function decoderBase64(value) {
  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function cleDuGroupe(groupId) {
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto n’est pas disponible dans ce navigateur.')
  if (cles.has(groupId)) return cles.get(groupId)

  const chargement = (async () => {
    const storageKey = `${PREFIXE_CLE}${groupId}`
    let encoded = localStorage.getItem(storageKey)
    if (!encoded) {
      const raw = crypto.getRandomValues(new Uint8Array(32))
      encoded = encoderBase64(raw)
      localStorage.setItem(storageKey, encoded)
    }
    return crypto.subtle.importKey('raw', decoderBase64(encoded), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
  })()

  cles.set(groupId, chargement)
  try {
    return await chargement
  } catch (error) {
    cles.delete(groupId)
    throw error
  }
}

export async function chiffrerMessage(groupId, texte) {
  const key = await cleDuGroupe(groupId)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const chiffre = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(texte))
  return { chiffre: encoderBase64(new Uint8Array(chiffre)), iv: encoderBase64(iv) }
}

export async function dechiffrerMessage(groupId, message) {
  const key = await cleDuGroupe(groupId)
  const clair = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: decoderBase64(message.iv) },
    key,
    decoderBase64(message.chiffre),
  )
  return new TextDecoder().decode(clair)
}
