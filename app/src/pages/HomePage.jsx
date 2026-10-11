import { useState } from 'react'
import { href, useRouter } from '../router.js'
import { categories, trustStats, howItWorks, testimonials } from '../data/catalog.js'
import { useStore } from '../store-context.js'
import { tierCriteria } from '../data/onboarding.js'
import { YardCard, RfqCard, Stars } from '../components/Cards.jsx'

export function HomePage() {
  const [role, setRole] = useState('shipowner')
  const { navigate } = useRouter()
  const { shipyards, rfqs } = useStore()
  const featured = shipyards.filter((y) => !y.pending).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="mk-hero">
        <div className="mk-container mk-hero-inner">
          <div>
            <span className="mk-hero-badge">🚀 Indonesia's Maritime Delivery Network</span>
            <h1>From project opportunity to <em>verified execution.</em></h1>
            <p className="lead">Kalimas Shipyard Hub connects ship owners and SIUPAL holders with a nationwide network of verified shipyards — orchestrated by Kalimas, secured by escrow, tracked by milestone.</p>
            <div className="mk-hero-actions">
              <a className="mk-btn mk-btn-primary mk-btn-lg" href={href('/post')}>Post an RFQ — it's free</a>
              <a className="mk-btn mk-btn-ghost mk-btn-lg" href={href('/directory')}>Browse 320+ shipyards</a>
            </div>
            <div className="mk-hero-trust">
              <div><b>320+</b><small>Verified shipyards</small></div>
              <div><b>1,850</b><small>SIUPAL owners</small></div>
              <div><b>98.6%</b><small>On-time delivery</small></div>
            </div>
          </div>
          <div className="mk-hero-card">
            <h3>Live RFQ feed <span>● updating</span></h3>
            {rfqs.slice(0, 4).map(r => (
              <div className="mk-mini-row" key={r.id}>
                <span className="av">{r.type === 'repair' ? '🛠️' : r.type === 'newbuild' ? '🚢' : r.type === 'conversion' ? '⚙️' : '🔍'}</span>
                <span className="meta">
                  <b>{r.title}</b>
                  <small>{r.owner} · {r.budget}</small>
                </span>
                <span className="tag">{r.bids} bids</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mk-trust">
        <div className="mk-container mk-trust-grid">
          {trustStats.map(s => (
            <div key={s.label}><div className="ic">{s.icon}</div><b>{s.value}</b><small>{s.label}</small></div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Source by service</span>
            <h2>One network, every maritime service</h2>
            <p>From routine docking to complex new-builds — find the right yard with the right capability, anywhere in Indonesia.</p>
          </div>
          <div className="mk-cat-grid">
            {categories.map(c => (
              <div key={c.id} className="mk-cat" onClick={() => navigate(`/directory?cat=${c.id}`)}>
                <div className="ic">{c.icon}</div>
                <b>{c.label}</b>
                <small>{c.count} yards</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED YARDS */}
      <section className="mk-section mk-section-alt">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Top rated</span>
            <h2>Featured shipyards this month</h2>
            <p>Gold-tier partners with verified capacity, class certification and proven on-time delivery.</p>
          </div>
          <div className="mk-yard-grid">
            {featured.map(y => <YardCard key={y.id} yard={y} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <a className="mk-btn mk-btn-ghost mk-btn-lg" href={href('/directory')}>View all shipyards →</a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">How it works</span>
            <h2>Trusted by owners and yards alike</h2>
            <p>Whether you're sourcing a yard or filling your docks, the Hub makes it simple and secure.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="mk-how-tabs">
              <button className={role === 'shipowner' ? 'active' : ''} onClick={() => setRole('shipowner')}>For Ship Owners</button>
              <button className={role === 'shipyard' ? 'active' : ''} onClick={() => setRole('shipyard')}>For Shipyards</button>
            </div>
          </div>
          <div className="mk-steps">
            {howItWorks[role].map(s => (
              <div className="mk-step" key={s.n}>
                <div className="n">{s.n}</div>
                <b>{s.title}</b>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE RFQ */}
      <section className="mk-section mk-section-alt">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Open now</span>
            <h2>Latest requests for quote</h2>
            <p>Verified SIUPAL owners posting real work. Shipyards bid live — transparently.</p>
          </div>
          <div className="mk-rfq-list">
            {rfqs.slice(0, 3).map(r => <RfqCard key={r.id} rfq={r} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mk-section">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Testimonials</span>
            <h2>Trusted across the archipelago</h2>
          </div>
          <div className="mk-testi-grid">
            {testimonials.map(t => (
              <div className="mk-testi" key={t.author}>
                <Stars rating={5} />
                <p className="q">“{t.quote}”</p>
                <div className="who">
                  <span className="av">{t.author.split(' ')[0][0]}{t.author.split(' ').slice(-1)[0][0]}</span>
                  <div><b>{t.author}</b><small>{t.role}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR SHIPYARDS */}
      <section className="mk-section mk-section-alt">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">For shipyards</span>
            <h2>Fill your docks with matched demand</h2>
            <p>Kalimas brings the customer, secures the payment and coordinates the project. You focus on the steel.</p>
          </div>
          <div className="mk-yard-tier-grid">
            {tierCriteria.map(t => (
              <div className="mk-tier-col" key={t.tier}>
                <span className={`mk-tier ${t.tier.toLowerCase()}`}>{t.tier}</span>
                <div className="mk-tier-score">Score ≥ {t.minScore} · dock ≥ {t.dock} m</div>
                <ul>
                  {t.perks.map(p => <li key={p}>✓ {p}</li>)}
                </ul>
                <a className="mk-btn mk-btn-ghost mk-btn-block" href={href('/join')}>Apply for {t.tier}</a>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <a className="mk-btn mk-btn-primary mk-btn-lg" href={href('/join')}>Start partner onboarding →</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mk-cta">
        <div className="mk-container mk-cta-inner">
          <div>
            <h2>Ready to join the network?</h2>
            <p>Whether you need a yard or have capacity to fill — Kalimas Shipyard Hub is your gateway to Indonesia's maritime economy.</p>
          </div>
          <div className="actions">
            <a className="mk-btn mk-btn-white mk-btn-lg" href={href('/post')}>Post an RFQ</a>
            <a className="mk-btn mk-btn-translucent mk-btn-lg" href={href('/join')}>Join as a shipyard</a>
          </div>
        </div>
      </section>
    </>
  )
}
