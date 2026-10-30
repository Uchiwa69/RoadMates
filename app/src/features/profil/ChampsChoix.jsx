// Champs de choix du profil : puces à sélection multiple avec ajout libre, et choix unique en boutons radio.
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Chip } from '../../shared/ui/index.js'
import { normaliser } from '../../shared/texte.js'

// Langues, centres d'intérêt : des suggestions à cocher, plus une valeur libre.
export function PucesSaisie({ id, legende, aide, valeurs, suggestions, onChange, placeholder }) {
  const [saisie, setSaisie] = useState('')
  const proposees = [...new Set([...valeurs, ...suggestions])]
  const basculer = (v) => onChange(valeurs.includes(v) ? valeurs.filter((x) => x !== v) : [...valeurs, v])
  const ajouter = () => {
    const v = saisie.trim().toLowerCase()
    if (!v) return
    if (!valeurs.some((x) => normaliser(x) === normaliser(v))) onChange([...valeurs, v])
    setSaisie('')
  }
  return (
    <fieldset className="choix" id={`champ-${id}`} tabIndex={-1}>
      <legend className="choix__legende">{legende}</legend>
      {aide && <p className="choix__aide">{aide}</p>}
      <div className="choix__puces">
        {proposees.map((v) => <Chip key={v} actif={valeurs.includes(v)} onClick={() => basculer(v)}>{v}</Chip>)}
      </div>
      <div className="choix__ajout">
        <input
          className="ui-input"
          value={saisie}
          aria-label={`Ajouter : ${legende.toLowerCase()}`}
          placeholder={placeholder}
          onChange={(e) => setSaisie(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); ajouter() } }}
          maxLength={30}
        />
        <button type="button" className="ui-chip" onClick={ajouter} disabled={!saisie.trim()}>
          <Plus size={16} aria-hidden="true" /> Ajouter
        </button>
      </div>
    </fieldset>
  )
}

// Choix unique : [{ valeur, libelle, explication? }] en boutons radio présentés comme des cartes.
export function ChoixUnique({ id, nom, legende, aide, options, valeur, onChange, cartes = false }) {
  return (
    <fieldset className="choix" id={`champ-${id}`} tabIndex={-1}>
      <legend className="choix__legende">{legende}</legend>
      {aide && <p className="choix__aide">{aide}</p>}
      <div className={cartes ? 'choix__cartes' : 'choix__puces'}>
        {options.map((o) => (
          <label key={o.valeur} className={cartes ? 'choix__carte' : 'choix__radio'}>
            <input type="radio" name={nom} value={o.valeur} checked={valeur === o.valeur} onChange={() => onChange(o.valeur)} />
            <span className="choix__libelle">{o.libelle}{o.detail && <span className="choix__detail"> · {o.detail}</span>}</span>
            {o.explication && <span className="choix__explication">{o.explication}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
