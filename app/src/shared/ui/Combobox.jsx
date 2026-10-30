// Champ avec suggestions (motif ARIA combobox) : flèches haut/bas, Entrée, Échap.
// Le parent filtre les suggestions à partir de `valeur` : [{ id, label, detail, icon }].
import { useEffect, useId, useState } from 'react'
import { useField } from './fieldContext.js'

export default function Combobox({
  valeur, onValeur, suggestions, onChoix, placeholder, vide, icon: Icon, className = '', inputProps = {},
}) {
  const field = useField()
  const autoId = useId()
  const id = field?.id ?? autoId
  const listeId = `${id}-liste`
  const [ouvert, setOuvert] = useState(false)
  const [actif, setActif] = useState(-1)

  const visible = ouvert && valeur.trim() !== ''
  const optionId = (i) => `${id}-opt-${i}`
  // Regroupe les suggestions consécutives d'un même `groupe` ; l'index i reste celui de la liste à plat.
  const groupes = []
  suggestions.forEach((s, i) => {
    const dernier = groupes.at(-1)
    if (dernier && dernier.nom === s.groupe) dernier.items.push({ s, i })
    else groupes.push({ nom: s.groupe, items: [{ s, i }] })
  })

  // La liste défile : l'option active au clavier reste visible.
  useEffect(() => {
    if (actif >= 0) document.getElementById(`${id}-opt-${actif}`)?.scrollIntoView({ block: 'nearest' })
  }, [actif, id])

  const choisir = (s) => {
    onChoix(s)
    setOuvert(false)
    setActif(-1)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOuvert(true)
      setActif((a) => Math.min(a + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActif((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && visible && suggestions.length) {
      e.preventDefault()
      choisir(suggestions[Math.max(actif, 0)])
    } else if (e.key === 'Escape') {
      if (visible) setOuvert(false)
      else onValeur('')
    }
  }

  return (
    <div className={['ui-combo', className].filter(Boolean).join(' ')}>
      {Icon && <Icon className="ui-combo__icone" size={20} aria-hidden="true" />}
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={listeId}
        aria-activedescendant={visible && actif >= 0 ? optionId(actif) : undefined}
        aria-describedby={field?.describedBy}
        aria-invalid={field?.invalid || undefined}
        className="ui-input ui-combo__input"
        value={valeur}
        placeholder={placeholder}
        onChange={(e) => { onValeur(e.target.value); setOuvert(true); setActif(-1) }}
        onFocus={() => setOuvert(true)}
        onBlur={() => setOuvert(false)}
        onKeyDown={onKeyDown}
        {...inputProps}
      />
      <div id={listeId} role="listbox" className="ui-combo__liste" hidden={!visible}>
        {groupes.map(({ nom, items }, g) => {
          const options = items.map(({ s, i }) => (
            <div
              key={s.id}
              id={optionId(i)}
              role="option"
              aria-selected={i === actif}
              className="ui-combo__option"
              onMouseDown={(e) => { e.preventDefault(); choisir(s) }}
              onMouseEnter={() => setActif(i)}
            >
              {s.icon && <s.icon size={18} aria-hidden="true" className="ui-combo__opt-icone" />}
              <span className="ui-combo__opt-label">{s.label}</span>
              {s.detail && <span className="ui-combo__opt-detail">{s.detail}</span>}
            </div>
          ))
          // Suggestions groupées (Villes, Activités…) : chaque groupe est annoncé par son intitulé.
          return nom ? (
            <div key={nom} role="group" aria-labelledby={`${id}-groupe-${g}`} className="ui-combo__groupe">
              <div id={`${id}-groupe-${g}`} role="presentation" className="ui-combo__groupe-nom">{nom}</div>
              {options}
            </div>
          ) : options
        })}
        {suggestions.length === 0 && vide && <div className="ui-combo__vide" role="presentation">{vide}</div>}
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {visible ? (suggestions.length ? `${suggestions.length} suggestion${suggestions.length > 1 ? 's' : ''}` : vide) : ''}
      </span>
    </div>
  )
}
