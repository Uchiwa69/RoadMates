// Suit une media query CSS, ex. useMediaQuery('(prefers-reduced-motion: reduce)').
import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query) {
  const subscribe = useCallback((cb) => {
    const mql = window.matchMedia(query)
    mql.addEventListener('change', cb)
    return () => mql.removeEventListener('change', cb)
  }, [query])
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

export const useMouvementReduit = () => useMediaQuery('(prefers-reduced-motion: reduce)')
