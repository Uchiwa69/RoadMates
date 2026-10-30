// Champ de formulaire : label, aide et erreur reliés au contrôle par aria-describedby.
// Input, Select et Textarea lisent le contexte : <Field label="E-mail" error={e}><Input /></Field>
import { useId } from 'react'
import { FieldContext } from './fieldContext.js'

export default function Field({ label, aide, error, requis = false, className = '', children }) {
  const id = useId()
  const aideId = aide ? `${id}-aide` : undefined
  const errId = error ? `${id}-err` : undefined
  const describedBy = [aideId, errId].filter(Boolean).join(' ') || undefined
  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: !!error }}>
      <div className={['ui-field', className].filter(Boolean).join(' ')}>
        <label htmlFor={id} className="ui-field__label">
          {label}{requis && <span aria-hidden="true" className="ui-field__requis"> *</span>}
        </label>
        {children}
        {aide && <p id={aideId} className="ui-field__aide">{aide}</p>}
        {error && <p id={errId} className="ui-field__erreur">{error}</p>}
      </div>
    </FieldContext.Provider>
  )
}
