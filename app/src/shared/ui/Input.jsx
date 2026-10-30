// Contrôles de saisie reliés à leur <Field>.
import { useField } from './fieldContext.js'

function liaison(field, props) {
  return {
    id: props.id ?? field?.id,
    'aria-describedby': props['aria-describedby'] ?? field?.describedBy,
    'aria-invalid': props['aria-invalid'] ?? (field?.invalid || undefined),
  }
}

export function Input({ className = '', ...props }) {
  const field = useField()
  return <input className={['ui-input', className].filter(Boolean).join(' ')} {...props} {...liaison(field, props)} />
}

export function Select({ className = '', children, ...props }) {
  const field = useField()
  return (
    <select className={['ui-input', 'ui-select', className].filter(Boolean).join(' ')} {...props} {...liaison(field, props)}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...props }) {
  const field = useField()
  return <textarea className={['ui-input', className].filter(Boolean).join(' ')} {...props} {...liaison(field, props)} />
}
