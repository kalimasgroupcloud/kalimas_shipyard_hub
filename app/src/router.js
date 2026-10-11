// Lightweight dependency-free hash router for KSH platform.
// Routes look like #/, #/directory, #/rfq, #/dashboard, #/yard/SY-001
import { useState, useEffect } from 'react'

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [pathPart, queryPart] = raw.split('?')
  const segments = pathPart.split('/').filter(Boolean)
  const params = {}
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => { params[k] = v })
  }
  return { segments, params }
}

export function useRouter() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    if (!window.location.hash) window.location.hash = '#/'
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (to) => {
    const normalized = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`
    window.location.hash = normalized
  }

  const page = route.segments[0] || 'home'
  const subId = route.segments[1]

  return { page, subId, params: route.params, navigate }
}

// Helper to build hrefs for <a> usage (keeps SPA feel without full page reload)
export const href = (to) => (to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`)
