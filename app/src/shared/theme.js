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
  choisirTheme(themeEffectif() === 'dark' ? 'light' : 'dark')
}

// Choix explicite depuis le profil : 'light', 'dark', ou 'auto' pour suivre le système.
export function choisirTheme(choix) {
  if (choix === 'auto') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = choix
  try {
    if (choix === 'auto') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, choix)
  } catch {
    // stockage indisponible : le choix vaut pour la session
  }
  listeners.forEach((l) => l())
}

// Le choix tel que l'utilisateur l'a fait : 'light', 'dark' ou 'auto'.
export function useChoixTheme() {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || 'auto', () => 'auto')
}
