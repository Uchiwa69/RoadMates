// Champ « Quand ? » de la recherche : un bouton qui affiche la période et ouvre le calendrier
// (PlageDates) dans une feuille modale. La période n'est appliquée qu'à « Valider ».
import { useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Button, Feuille, PlageDates } from '../../../shared/ui/index.js'
import { aujourdhui, formatPeriode } from '../dates.js'

// moisInitial : mois affiché à l'ouverture sans date choisie (ex. celui où des voyageurs sont là).
export default function ChampQuand({ debut, fin, onChange, moisInitial, className = '' }) {
  const [ouvert, setOuvert] = useState(false)
  const [brouillon, setBrouillon] = useState({ debut: debut ?? '', fin: fin ?? '' })
  const bouton = useRef(null)
  const choisies = Boolean(debut && fin)

  const ouvrir = () => {
    setBrouillon({ debut: debut ?? '', fin: fin ?? '' })
    setOuvert(true)
  }
  const valider = () => {
    onChange(brouillon)
    setOuvert(false)
  }
  const effacer = () => {
    setBrouillon({ debut: '', fin: '' })
    onChange({ debut: '', fin: '' })
    setOuvert(false)
  }

  return (
    <>
      <button ref={bouton} type="button" className={`champ-quand ${className}`} aria-haspopup="dialog" onClick={ouvrir}>
        <CalendarDays size={20} aria-hidden="true" className="champ-quand__icone" />
        <span className="champ-quand__texte">
          <span className="champ-quand__label">Quand ?</span>
          <span className={`champ-quand__valeur${choisies ? '' : ' champ-quand__valeur--vide'}`}>
            {choisies ? formatPeriode({ debut, fin }) : 'Ajouter des dates'}
          </span>
        </span>
      </button>
      <Feuille
        ouvert={ouvert}
        onFermer={() => setOuvert(false)}
        titre="Vos dates"
        declencheur={bouton}
        pied={(
          <>
            <Button variant="fantome" onClick={effacer}>Effacer</Button>
            <Button onClick={valider} disabled={!brouillon.debut || !brouillon.fin}>Valider</Button>
          </>
        )}
      >
        <PlageDates debut={brouillon.debut} fin={brouillon.fin} min={aujourdhui()} onChange={setBrouillon} moisInitial={moisInitial} />
      </Feuille>
    </>
  )
}
