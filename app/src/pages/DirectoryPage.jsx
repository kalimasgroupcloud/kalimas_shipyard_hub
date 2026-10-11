import { useState, useMemo } from 'react'
import { categories } from '../data/catalog.js'
import { useStore } from '../store-context.js'
import { YardCard } from '../components/Cards.jsx'

export function DirectoryPage({ params }) {
  const { shipyards } = useStore()
  const initialCat = params.cat || 'all'
  const [cat, setCat] = useState(initialCat)
  const [tier, setTier] = useState('all')
  const [sort, setSort] = useState('score')
  const [q, setQ] = useState(params.q || '')

  const filtered = useMemo(() => {
    let list = shipyards.filter(y => {
      const matchCat = cat === 'all' || y.specialties.includes(cat)
      const matchTier = tier === 'all' || y.tier.toLowerCase() === tier
      const matchQ = !q || `${y.name} ${y.location}`.toLowerCase().includes(q.toLowerCase())
      return matchCat && matchTier && matchQ
    })
    list = [...list].sort((a, b) => {
      if (sort === 'score') return b.score - a.score
      if (sort === 'rating') return b.rating - a.rating
      if (sort === 'capacity') return (a.capacity.used / a.capacity.total) - (b.capacity.used / b.capacity.total)
      return 0
    })
    return list
  }, [cat, tier, sort, q, shipyards])

  return (
    <>
      <section className="mk-page-head">
        <div className="mk-container">
          <span className="mk-kicker" style={{ color: '#ffb27a' }}>Shipyard directory</span>
          <h1>Browse verified shipyards</h1>
          <p>Filter by service, tier and capacity. Every yard is class-certified and escrow-enabled through Kalimas.</p>
          <div className="mk-filters">
            <input className="mk-chip" style={{ border: 'none', minWidth: 220 }} placeholder="Search by name or city…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className={`mk-chip ${cat === 'all' ? 'active' : ''}`} onClick={() => setCat('all')}>All services</button>
            {categories.map(c => (
              <button key={c.id} className={`mk-chip ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>{c.icon} {c.label}</button>
            ))}
          </div>
          <div className="mk-filters" style={{ marginTop: 12 }}>
            <span style={{ alignSelf: 'center', fontSize: 13, color: '#9aa6b6' }}>Tier:</span>
            {['all', 'gold', 'silver', 'bronze'].map(t => (
              <button key={t} className={`mk-chip ${tier === t ? 'active' : ''}`} onClick={() => setTier(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
            ))}
            <span style={{ alignSelf: 'center', fontSize: 13, color: '#9aa6b6', marginLeft: 8 }}>Sort:</span>
            <button className={`mk-chip ${sort === 'score' ? 'active' : ''}`} onClick={() => setSort('score')}>Match score</button>
            <button className={`mk-chip ${sort === 'rating' ? 'active' : ''}`} onClick={() => setSort('rating')}>Rating</button>
            <button className={`mk-chip ${sort === 'capacity' ? 'active' : ''}`} onClick={() => setSort('capacity')}>Most availability</button>
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-container">
          <p style={{ color: 'var(--km-muted)', marginBottom: 20 }}><b style={{ color: 'var(--km-ink)' }}>{filtered.length}</b> shipyards found</p>
          {filtered.length > 0 ? (
            <div className="mk-yard-grid">
              {filtered.map(y => <YardCard key={y.id} yard={y} />)}
            </div>
          ) : (
            <div className="mk-panel" style={{ textAlign: 'center', padding: 48 }}>
              <h3>No shipyards match your filters</h3>
              <p style={{ color: 'var(--km-muted)' }}>Try clearing the tier or service filters.</p>
              <button className="mk-btn mk-btn-outline" onClick={() => { setCat('all'); setTier('all'); setQ('') }}>Reset filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
