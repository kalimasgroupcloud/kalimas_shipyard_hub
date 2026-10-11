import { useState } from 'react'
import { href } from '../router.js'
import { escrowMilestones, platformMetrics } from '../data/catalog.js'
import { useStore } from '../store-context.js'

const statusMeta = {
  released: { label: 'Released', icon: '✓' },
  verifying: { label: 'Verifying', icon: '⏳' },
  locked: { label: 'Locked', icon: '🔒' },
}

const NAV = [
  ['overview', '◎', 'Overview'],
  ['projects', '▤', 'My projects'],
  ['escrow', '🔒', 'Escrow & milestones'],
  ['rfqs', '◈', 'My RFQs'],
  ['bids', '💬', 'Bids received'],
  ['partner', '⚓', 'Yard partner profile'],
]

export function DashboardPage() {
  const { shipyards, rfqs, user } = useStore()
  const [tab, setTab] = useState('overview')
  const releasedPct = escrowMilestones.filter(m => m.status === 'released').reduce((s, m) => s + m.weight, 0)
  const openRfqs = rfqs.length
  const totalBids = rfqs.reduce((s, r) => s + (r.bids || 0), 0)

  return (
    <section className="mk-section">
      <div className="mk-container mk-dash">
        <aside className="mk-dash-nav">
          <h4>Workspace</h4>
          {NAV.map(([id, icon, label]) => (
            <a key={id} href="#/dashboard" className={tab === id ? 'active' : ''} onClick={(e) => { e.preventDefault(); setTab(id) }}>
              <span>{icon}</span> {label}
            </a>
          ))}
          <h4 style={{ marginTop: 18 }}>Account</h4>
          <a href={href('/')}><span>⚙️</span> Settings</a>
          <a href={href('/')}><span>↩</span> Back to site</a>
        </aside>

        <div className="mk-dash-main">
          <div className="mk-dash-title">
            <div>
              <h1>Dashboard overview</h1>
              <p style={{ color: 'var(--km-muted)', margin: '4px 0 0' }}>
            {user
              ? <>Signed in as <b>{user.name}</b>{user.email ? ` · ${user.email}` : ''} · via {user.method === 'google' ? 'Google' : 'Email'} ✓</>
              : <>Signed in as <b>PT Pelayaran Nusantara Jaya</b> · SIUPAL-2019-0421 ✓ (demo)</>}
          </p>
            </div>
            <a className="mk-btn mk-btn-primary" href={href('/post')}>＋ New project</a>
          </div>

          <div className="mk-stat-row">
            <div className="mk-stat"><small>Active projects</small><b>{platformMetrics.activeProjects}</b></div>
            <div className="mk-stat"><small>Open RFQs</small><b>{openRfqs}</b></div>
            <div className="mk-stat"><small>Bids received</small><b>{totalBids}</b></div>
            <div className="mk-stat"><small>Escrow secured</small><b>Rp 6.0 M</b></div>
          </div>


          {(tab === 'overview' || tab === 'escrow') && (
            <div className="mk-panel">
              <div className="mk-panel-head">
                <h3>Active project — Tugboat 2,400 HP dry-dock</h3>
                <span className="mk-tag">RFQ-2041 · KSO Yard Makassar</span>
              </div>
              <div className="mk-escrow-note">
                <span className="ic">🔒</span>
                <div>
                  <b>Escrow active · {releasedPct}% released</b>
                  <p>Funds release automatically as physical milestones are verified via geo-tagged evidence and dual approval.</p>
                  <a className="mk-btn mk-btn-outline" style={{ fontSize: 12, padding: '6px 13px', marginTop: 10 }} href={href('/escrow')}>Open Escrow Control Center →</a>
                </div>
              </div>
              <div className="mk-gantt" aria-hidden="true">
                {escrowMilestones.map(m => <span key={m.id} style={{ height: `${30 + m.weight}%`, opacity: m.status === 'released' ? 1 : m.status === 'verifying' ? 0.6 : 0.25 }} />)}
              </div>
              <div style={{ marginTop: 10 }}>
                {escrowMilestones.map(m => (
                  <div className={`mk-ms ${m.status}`} key={m.id}>
                    <span className="mk-ms-dot">{statusMeta[m.status].icon}</span>
                    <div className="mk-ms-info">
                      <b>{m.name}</b>
                      <small>Weight {m.weight}% {m.date !== '—' ? `· completed ${m.date}` : ''}</small>
                    </div>
                    <div className="mk-ms-right">
                      <div className="mk-ms-amount">{m.amount}</div>
                      <span className={`mk-ms-status ${m.status}`}>{statusMeta[m.status].label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tab === 'overview' || tab === 'projects') && (
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Project pipeline</h3></div>
              {rfqs.slice(0, 4).map(r => (
                <div className="mk-ms" key={r.id}>
                  <span className="mk-ms-dot" style={{ background: '#eef1f5' }}>⚓</span>
                  <div className="mk-ms-info">
                    <b>{r.title}</b>
                    <small>{r.owner} · {r.budget} · {r.bids} bids</small>
                  </div>
                  <div className="mk-ms-right">
                    <span className={`mk-ms-status ${r.bids > 6 ? 'released' : 'verifying'}`}>{r.bids > 6 ? 'Competitive' : 'Collecting bids'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(tab === 'overview' || tab === 'rfqs') && (
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>AI capacity match — your demand vs network</h3></div>
              <p style={{ color: 'var(--km-muted)', fontSize: 13, marginTop: 0 }}>Live utilisation across partner yards. Kalimas routes overflow demand to available slots.</p>
              {shipyards.map(y => {
                const pct = Math.round((y.capacity.used / y.capacity.total) * 100)
                return (
                  <div className="mk-ms" key={y.id}>
                    <div className="mk-ms-info" style={{ minWidth: 220 }}>
                      <b>{y.name}</b>
                      <small>{y.location}</small>
                    </div>
                    <div className="mk-ms-right" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'flex-end' }}>
                      <div className="mk-cap-bar" style={{ width: 180 }}><span style={{ width: `${pct}%` }} /></div>
                      <span style={{ fontSize: 12.5, color: 'var(--km-muted)', minWidth: 34, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {tab === 'partner' && (
            <div className="mk-panel" style={{ textAlign: 'center', padding: 48 }}>
              <h3>Register your shipyard as a partner</h3>
              <p style={{ color: 'var(--km-muted)', maxWidth: 480, margin: '0 auto 20px' }}>Submit your BKI/class certification and capacity matrix to start receiving matched RFQs. Kalimas handles the customer, escrow and coordination.</p>
              <a className="mk-btn mk-btn-primary mk-btn-lg" href={href('/join')}>Register your shipyard</a>
            </div>
          )}

          {tab === 'bids' && (
            <div className="mk-panel">
              <div className="mk-panel-head"><h3>Bids on your projects</h3></div>
              {rfqs.map(r => (
                <div className="mk-ms" key={r.id}>
                  <span className="mk-ms-dot" style={{ background: '#fdeef0', color: 'var(--km-red)' }}>💬</span>
                  <div className="mk-ms-info">
                    <b>{r.title}</b>
                    <small>{r.bids} shipyards bidding · closes {r.deadline}</small>
                  </div>
                  <div className="mk-ms-right"><a className="mk-btn mk-btn-ghost" href={href(`/rfq/${r.id}`)}>Review</a></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
