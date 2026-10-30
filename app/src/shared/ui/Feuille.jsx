// Feuille modale (bas de l'écran sur mobile, fenêtre centrée sur ordinateur), sur <dialog> natif :
// showModal() rend le reste de la page inerte (focus piégé), Échap ferme, le focus revient au déclencheur.
// Safari ne donne pas le focus à un bouton cliqué : passer declencheur (ref du bouton qui ouvre).
import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function Feuille({ ouvert, onFermer, titre, children, pied, declencheur: refDeclencheur }) {
  const dialog = useRef(null)
  const declencheur = useRef(null)
  const fermer = useRef(onFermer)
  const titreId = useId()

  useEffect(() => { fermer.current = onFermer })

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (ouvert && !d.open) {
      declencheur.current = refDeclencheur?.current ?? document.activeElement
      d.showModal()
    } else if (!ouvert && d.open) d.close()
  }, [ouvert, refDeclencheur])

  useEffect(() => {
    const d = dialog.current
    const onClose = () => {
      fermer.current?.()
      // Après la restauration propre au navigateur (Safari remet le focus sur l'élément d'avant).
      requestAnimationFrame(() => declencheur.current?.focus?.())
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  return (
    <dialog
      ref={dialog}
      className="ui-feuille"
      aria-labelledby={titreId}
      // Un clic sur le voile (hors du contenu) ferme la feuille.
      onClick={(e) => { if (e.target === dialog.current) dialog.current.close() }}
    >
      <div className="ui-feuille__boite">
        <div className="ui-feuille__tete">
          <h2 id={titreId} className="ui-feuille__titre">{titre}</h2>
          <button type="button" className="ui-feuille__fermer" aria-label="Fermer" onClick={() => dialog.current.close()}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="ui-feuille__corps">{ouvert && children}</div>
        {pied && ouvert && <div className="ui-feuille__pied">{pied}</div>}
      </div>
    </dialog>
  )
}
