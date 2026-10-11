import { useState } from 'react'
import { href } from '../router.js'
import { categories, yardCompliance } from '../data/catalog.js'
import { useStore } from '../store-context.js'
import { YardCard, Stars } from '../components/Cards.jsx'
import { CompliancePanel } from '../components/CompliancePanel.jsx'

export function YardDetailPage({ subId }) {
  const { shipyards } = useStore()
  const yard = shipyards.find(y => y.id === subId)
  const [requested, setRequested] = useState(false)

  if (!yard) {
    return (
      <section className="mk-section"><div className="mk-container">
        <div className="mk-panel" style={{ textAlign: 'center' }}>
          <h3>Shipyard not found</h3>
          <a className="mk-btn mk-btn-outline" href={href('/directory')}>Back to directory</a>
        </div>
      </div></section>
    )
  }

  const capPct = Math.round((yard.capacity.used / yard.capacity.total) * 100)
  const related = shipyards.filter(y => y.id !== yard.id && y.specialties.some(s => yard.specialties.includes(s))).slice(0, 3)

  return (
    <>
      <section className="mk-page-head">
        <div className="mk-container">
          <div className="mk-breadcrumb"><a href={href('/')}>Home</a> / <a href={href('/directory')}>Directory</a> / {yard.name}</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0 }}>{yard.name}</h1>
            <span className={`mk-tier ${yard.tier.toLowerCase()}`} style={{ position: 'static' }}>{yard.tier}</span>
            {yard.verified && <span className="mk-verified" style={{ position: 'static' }}>✓ Verified</span>}
          </div>
          <p>📍 {yard.location} · Est. {yard.established} · Responds {yard.responseTime}</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-container mk-detail-grid">
          <div>
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>About this yard</h3></div>
              <p style={{ lineHeight: 1.6 }}>{yard.blurb}</p>
              <div className="mk-info-list">
                <div><small>Dock length</small><b>{yard.dockLength} m</b></div>
                <div><small>Dock breadth</small><b>{yard.dockBreadth} m</b></div>
                <div><small>Crane capacity</small><b>{yard.crane}</b></div>
                <div><small>Graving docks</small><b>{yard.gravingDocks}</b></div>
                <div><small>Projects delivered</small><b>{yard.projectsDone}</b></div>
                <div><small>Match score</small><b>{yard.score}/100</b></div>
              </div>
            </div>

            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Certifications</h3></div>
              <div>
                {yard.certifications.map(c => <span key={c} className="mk-cert">✓ {c}</span>)}
              </div>
            </div>

            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Specialties</h3></div>
              <div className="mk-tags">
                {yard.specialties.map(s => {
                  const cat = categories.find(c => c.id === s)
                  return <span key={s} className="mk-tag">{cat ? cat.icon + ' ' + cat.label : s}</span>
                })}
              </div>
            </div>

            <CompliancePanel yard={yard} compliance={yardCompliance[yard.id]} />
          </div>

          <aside>
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Capacity</h3></div>
              <div style={{ fontSize: 26, color: 'var(--km-ink)', fontWeight: 800 }}>{capPct}% <small style={{ fontSize: 13, color: 'var(--km-muted)', fontWeight: 500 }}>utilised</small></div>
              <div className="mk-cap-bar" style={{ width: '100%', marginTop: 10 }}><span style={{ width: `${capPct}%` }} /></div>
              <p style={{ fontSize: 12.5, color: 'var(--km-muted)', marginTop: 10 }}>{yard.capacity.total - yard.capacity.used} of {yard.capacity.total} slot-units available.</p>
            </div>

            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Reputation</h3></div>
              <Stars rating={yard.rating} />
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--km-ink)' }}>{yard.rating.toFixed(1)} <small style={{ fontSize: 13, color: 'var(--km-muted)', fontWeight: 500 }}>({yard.reviews} reviews)</small></div>
            </div>

            <div className="mk-panel">
              {requested ? (
                <div className="mk-escrow-note">
                  <span className="ic">✅</span>
                  <div><b>Request sent (demo)</b><p>Kalimas will coordinate an introduction and escrow setup for your project.</p></div>
                </div>
              ) : (
                <button className="mk-btn mk-btn-primary mk-btn-block" onClick={() => setRequested(true)}>Request a quote</button>
              )}
              <p style={{ fontSize: 12, color: 'var(--km-muted)', textAlign: 'center', marginTop: 10 }}>Payments secured by Kalimas escrow.</p>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mk-section mk-section-alt">
          <div className="mk-container">
            <div className="mk-section-head"><span className="mk-kicker center">Similar</span><h2>You might also consider</h2></div>
            <div className="mk-yard-grid">{related.map(y => <YardCard key={y.id} yard={y} />)}</div>
          </div>
        </section>
      )}
    </>
  )
}
