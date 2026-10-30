// Champ « Quand ? » de la recherche : un bouton qui affiche la période et ouvre le calendrier
// (PlageDates) dans une feuille modale. La période n'est appliquée qu'à « Valider ».
import { useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Button, Feuille, PlageDates } from '../../../shared/ui/index.js'
import { aujourdhui, formatPeriode } from '../dates.js'

// La feuille seule, pour l'ouvrir depuis un autre bouton (ex. « Choisir mes dates » sur une carte de ville).
// moisInitial : mois affiché à l'ouverture sans date choisie (ex. celui où des voyageurs sont là).
export function FeuilleDates({ ouvert, onFermer, debut, fin, onValider, onEffacer, moisInitial, declencheur, titre = 'Vos dates' }) {
  const [brouillon, setBrouillon] = useState({ debut: debut ?? '', fin: fin ?? '' })
  const [ouvertPrecedent, setOuvertPrecedent] = useState(ouvert)
  // À chaque ouverture, on repart des dates actuelles.
  if (ouvert !== ouvertPrecedent) {
    setOuvertPrecedent(ouvert)
    if (ouvert) setBrouillon({ debut: debut ?? '', fin: fin ?? '' })
  }
  return (
    <Feuille
      ouvert={ouvert}
      onFermer={onFermer}
      titre={titre}
      declencheur={declencheur}
      pied={(
        <>
          {onEffacer && <Button variant="fantome" onClick={() => { setBrouillon({ debut: '', fin: '' }); onEffacer() }}>Effacer</Button>}
          <Button onClick={() => onValider(brouillon)} disabled={!brouillon.debut || !brouillon.fin}>Valider</Button>
        </>
      )}
    >
      <PlageDates debut={brouillon.debut} fin={brouillon.fin} min={aujourdhui()} onChange={setBrouillon} moisInitial={moisInitial} />
    </Feuille>
  )
}

export default function ChampQuand({ debut, fin, onChange, moisInitial, className = '' }) {
  const [ouvert, setOuvert] = useState(false)
  const bouton = useRef(null)
  const choisies = Boolean(debut && fin)

  return (
    <>
      <button ref={bouton} type="button" className={`champ-quand ${className}`} aria-haspopup="dialog" onClick={() => setOuvert(true)}>
        <CalendarDays size={20} aria-hidden="true" className="champ-quand__icone" />
        <span className="champ-quand__texte">
          <span className="champ-quand__label">Quand ?</span>
          <span className={`champ-quand__valeur${choisies ? '' : ' champ-quand__valeur--vide'}`}>
            {choisies ? formatPeriode({ debut, fin }) : 'Ajouter des dates'}
          </span>
        </span>
      </button>
      <FeuilleDates
        ouvert={ouvert}
        onFermer={() => setOuvert(false)}
        debut={debut}
        fin={fin}
        moisInitial={moisInitial}
        declencheur={bouton}
        onValider={(dates) => { onChange(dates); setOuvert(false) }}
        onEffacer={() => { onChange({ debut: '', fin: '' }); setOuvert(false) }}
      />
    </>
  )
}
