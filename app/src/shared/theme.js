// Thème clair / sombre. Par défaut on suit le système ; un choix manuel est mémorisé.
// index.html applique le choix mémorisé avant le premier rendu (pas de flash).
import { useSyncExternalStore } from 'react'

const KEY = 'roadmates-theme'
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
const listeners = new Set()

function themeEffectif() {
  return document.documentElement.dataset.theme || (media?.matches ? 'dark' : 'light')
}

function subscribe(listener) {
  listeners.add(listener)
  media?.addEventListener('change', listener)
  return () => {
    listeners.delete(listener)
    media?.removeEventListener('change', listener)
  }
}

export function useTheme() {
  return useSyncExternalStore(subscribe, themeEffectif, () => 'light')
}

export function basculerTheme() {
  const suivant = themeEffectif() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = suivant
  try {
    localStorage.setItem(KEY, suivant)
  } catch {
    // stockage indisponible : le choix vaut pour la session
  }
  listeners.forEach((l) => l())
}
