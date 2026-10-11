import { createContext, useContext } from 'react'

// Split from store.jsx so the provider file exports only a component.
// This satisfies Vite's React Fast Refresh rule (one export per file for
// components) while letting any component read the live store via useStore().
export const StoreContext = createContext(null)

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
