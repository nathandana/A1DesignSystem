import { createContext, useContext } from 'react'

// Context value is the t(key, fallback) function from main.jsx App.
// Defaults to a no-op that returns the fallback so pages still render
// correctly outside the provider (tests, standalone previews).
const TContext = createContext((key, fallback) => fallback ?? key)

export const TProvider = TContext.Provider

export function useT() {
  return useContext(TContext)
}
