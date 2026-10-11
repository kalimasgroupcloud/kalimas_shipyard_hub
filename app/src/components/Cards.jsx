import { href } from '../router.js'
import { yardCompliance } from '../data/catalog.js'

export function Stars({ rating }) {
  const full = Math.round(rating)
  return <span className="mk-stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
}

export function YardCard({ yard }) {
  const capPct = Math.round((yard.capacity.used / yard.capacity.total) * 100)
  const isBki = yardCompliance[yard.id]
  return (
    <a className="mk-yard-card" href={href(`/yard/${yard.id}`)}>
      <div className="mk-yard-cover">
        <span className={`mk-tier ${yard.tier.toLowerCase()}`}>{yard.tier}</span>
        {yard.verified && <span className="mk-verified">✓ Verified</span>}
        {isBki && <span className="mk-bki-badge">🏛️ BKI Class</span>}
      </div>
      <div className="mk-yard-body">
        <h3>{yard.name}</h3>
        <div className="mk-yard-loc">📍 {yard.location}</div>
        <div className="mk-yard-specs">
          <div><small>Dock LOA</small><b>{yard.dockLength} m</b></div>
          <div><small>Crane</small><b>{yard.crane}</b></div>
          <div><small>Docks</small><b>{yard.gravingDocks}</b></div>
        </div>
        <div className="mk-yard-foot">
          <div>
            <Stars rating={yard.rating} />
            <div className="mk-rating">{yard.rating.toFixed(1)} <small>({yard.reviews})</small></div>
          </div>
          <div className="mk-cap">
            Capacity {capPct}%
            <div className="mk-cap-bar"><span style={{ width: `${capPct}%` }} /></div>
          </div>
        </div>
      </div>
    </a>
  )
}

export function RfqCard({ rfq }) {
  const initials = rfq.owner.replace(/[^A-Za-z ]/g, '').split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div className="mk-rfq">
      <div>
        <div className="mk-rfq-meta">
          <span>{rfq.postedAgo}</span>
          <span>· {rfq.vessel} · LOA {rfq.loa} m</span>
        </div>
        <h3>{rfq.title}</h3>
        <div className="mk-owner">
          <span className="av">{initials}</span>
          <span>{rfq.owner}</span>
          {rfq.verified && <span className="mk-siupal">✓ SIUPAL {rfq.siupal.split('-')[1]}</span>}
        </div>
        <p className="mk-rfq-sum">{rfq.summary}</p>
        <div className="mk-tags">
          {rfq.tags.map(t => <span key={t} className="mk-tag">{t}</span>)}
        </div>
      </div>
      <div className="mk-rfq-side">
        <div className="budget">{rfq.budget}</div>
        <div className="bids">💬 {rfq.bids} bids · closes {rfq.deadline}</div>
        <a className="mk-btn mk-btn-outline mk-btn-block" href={href(`/rfq/${rfq.id}`)}>View &amp; bid</a>
      </div>
    </div>
  )
}
