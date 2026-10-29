// Contexte partagé entre <Field> et les contrôles de saisie.
import { createContext, useContext } from 'react'

export const FieldContext = createContext(null)

export function useField() {
  return useContext(FieldContext)
}
