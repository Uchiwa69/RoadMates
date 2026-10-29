// Confirmations brèves, annoncées aux lecteurs d'écran (aria-live).
import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { ToastContext } from './toastContext.js'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const compteur = useRef(0)

  const fermer = useCallback((id) => setToasts((ts) => ts.filter((t) => t.id !== id)), [])
  const toast = useCallback((message) => {
    const id = ++compteur.current
    setToasts((ts) => [...ts.slice(-1), { id, message }])
    setTimeout(() => fermer(id), 3500)
  }, [fermer])
  const valeur = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={valeur}>
      {children}
      <div className="ui-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="ui-toast">
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{t.message}</span>
            <button type="button" className="ui-toast__fermer" onClick={() => fermer(t.id)} aria-label="Fermer la notification">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
