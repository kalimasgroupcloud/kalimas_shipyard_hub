import { useState } from 'react'
import { href } from '../router.js'
import { categories } from '../data/catalog.js'
import { useStore } from '../store-context.js'
import { RfqCard } from '../components/Cards.jsx'
import { BiddingDashboard } from '../components/BiddingDashboard.jsx'

export function RfqBoardPage() {
  const { rfqs } = useStore()
  const [type, setType] = useState('all')
  const filtered = rfqs.filter(r => type === 'all' || r.type === type)

  return (
    <>
      <section className="mk-page-head">
        <div className="mk-container">
          <span className="mk-kicker" style={{ color: '#ffb27a' }}>RFQ board</span>
          <h1>Open requests for quote</h1>
          <p>Verified SIUPAL owners competing for the best yard. Browse live demand or post your own project.</p>
          <div className="mk-filters">
            <button className={`mk-chip ${type === 'all' ? 'active' : ''}`} onClick={() => setType('all')}>All projects</button>
            {categories.map(c => (
              <button key={c.id} className={`mk-chip ${type === c.id ? 'active' : ''}`} onClick={() => setType(c.id)}>{c.icon} {c.label}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ color: 'var(--km-muted)', margin: 0 }}><b style={{ color: 'var(--km-ink)' }}>{filtered.length}</b> open RFQs</p>
            <a className="mk-btn mk-btn-primary" href={href('/post')}>＋ Post an RFQ</a>
          </div>
          <div className="mk-rfq-list">
            {filtered.map(r => <RfqCard key={r.id} rfq={r} />)}
          </div>
        </div>
      </section>
    </>
  )
}

const typeIcon = { repair: '🛠️', newbuild: '🚢', conversion: '⚙️', steel: '🏗️', engine: '🔧', survey: '🔍' }

export function RfqDetailPage({ subId }) {
  const { rfqs, shipyards, addBid } = useStore()
  const rfq = rfqs.find(r => r.id === subId)
  const [bid, setBid] = useState('')
  const [duration, setDuration] = useState('')
  const [warranty, setWarranty] = useState('12 months')
  const [submitted, setSubmitted] = useState(false)

  if (!rfq) {
    return (
      <section className="mk-section"><div className="mk-container">
        <div className="mk-panel" style={{ textAlign: 'center' }}>
          <h3>RFQ not found</h3>
          <a className="mk-btn mk-btn-outline" href={href('/rfq')}>Back to board</a>
        </div>
      </div></section>
    )
  }

  // Simple AI-style matchmaking: yards whose dock fits the vessel LOA & specialty
  const matched = shipyards
    .filter(y => y.dockLength >= rfq.loa && y.specialties.includes(rfq.type))
    .sort((a, b) => b.score - a.score)

  return (
    <>
      <section className="mk-page-head">
        <div className="mk-container">
          <div className="mk-breadcrumb"><a href={href('/')}>Home</a> / <a href={href('/rfq')}>RFQ Board</a> / {rfq.id}</div>
          <h1>{rfq.title}</h1>
          <p>{rfq.summary}</p>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-container mk-detail-grid">
          <div>
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Project overview</h3><span className="mk-tag">{typeIcon[rfq.type]} {rfq.type}</span></div>
              <div className="mk-info-list">
                <div><small>Vessel</small><b>{rfq.vessel}</b></div>
                <div><small>Length (LOA)</small><b>{rfq.loa} m</b></div>
                <div><small>Budget range</small><b>{rfq.budget}</b></div>
                <div><small>Preferred location</small><b>{rfq.location}</b></div>
                <div><small>Bid deadline</small><b>{rfq.deadline}</b></div>
                <div><small>Bids received</small><b>{rfq.bids}</b></div>
              </div>
              <div className="mk-tags" style={{ marginTop: 14 }}>
                {rfq.tags.map(t => <span key={t} className="mk-tag">{t}</span>)}
              </div>
            </div>

            <div className="mk-panel">
              <div className="mk-panel-head"><h3>AI-matched shipyards</h3><span className="mk-tag">{matched.length} capable</span></div>
              <p style={{ color: 'var(--km-muted)', fontSize: 13, marginTop: 0 }}>Yards whose dock length and specialty match this project. Kalimas remains the Main Project Operator.</p>
              {matched.map(y => (
                <div className="mk-ms" key={y.id}>
                  <span className="mk-ms-dot" style={{ background: '#eef1f5' }}>⚓</span>
                  <div className="mk-ms-info">
                    <b>{y.name}</b>
                    <small>Dock {y.dockLength} m · {y.location} · match {y.score}/100</small>
                  </div>
                  <div className="mk-ms-right">
                    <span className={`mk-tier ${y.tier.toLowerCase()}`} style={{ position: 'static' }}>{y.tier}</span>
                  </div>
                </div>
              ))}
              {matched.length === 0 && <p style={{ color: 'var(--km-muted)' }}>No direct match — Kalimas will source from the wider network.</p>}
            </div>

            <BiddingDashboard rfq={rfq} />
          </div>

          <aside>
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Buyer</h3></div>
              <div className="mk-owner" style={{ marginBottom: 10 }}>
                <span className="av">{rfq.owner[0]}</span>
                <div><b>{rfq.owner}</b><br /><span className="mk-siupal">✓ SIUPAL {rfq.siupal}</span></div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--km-muted)' }}>Verified ship owner. Payments secured via escrow milestone release.</p>
            </div>

            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Place your bid</h3></div>
              {submitted ? (
                <div className="mk-escrow-note">
                  <span className="ic">✅</span>
                  <div><b>Bid submitted (demo)</b><p>Your quotation of {bid || 'Rp —'} has been logged. In production this enters the live bidding dashboard.</p></div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); addBid(rfq.id, { price: bid, duration: duration || '—', warranty, tier: 'Silver', rating: 4.5, yard: 'Your Yard' }); setSubmitted(true) }}>
                  <label style={{ fontSize: 12.5, color: 'var(--km-muted)', display: 'block', marginBottom: 6 }}>Your price (IDR)</label>
                  <input className="mk-chip" style={{ width: '100%', border: '1px solid var(--km-line)', padding: '11px 14px', marginBottom: 12 }} placeholder="e.g. 5,200,000" value={bid} onChange={(e) => setBid(e.target.value)} required />
                  <label style={{ fontSize: 12.5, color: 'var(--km-muted)', display: 'block', marginBottom: 6 }}>Estimated duration (days)</label>
                  <input className="mk-chip" style={{ width: '100%', border: '1px solid var(--km-line)', padding: '11px 14px', marginBottom: 12 }} placeholder="e.g. 21" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  <label style={{ fontSize: 12.5, color: 'var(--km-muted)', display: 'block', marginBottom: 6 }}>Warranty offered</label>
                  <select className="mk-chip" style={{ width: '100%', border: '1px solid var(--km-line)', padding: '11px 14px', marginBottom: 14, background: '#fff' }} value={warranty} onChange={(e) => setWarranty(e.target.value)}>
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>12 months</option>
                    <option>18 months</option>
                    <option>24 months</option>
                  </select>
                  <button className="mk-btn mk-btn-primary mk-btn-block" type="submit">Submit bid</button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
