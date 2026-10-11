import { useMemo } from 'react'
import { useStore } from '../store-context.js'

const statusMeta = {
  released: { label: 'Released', icon: '✓', tone: 'released' },
  verifying: { label: 'Verifying', icon: '⏳', tone: 'verifying' },
  locked: { label: 'Locked', icon: '🔒', tone: 'locked' },
}

// Interactive Escrow Control Center — the platform's financial guarantee core.
// Verify a milestone with geo-tagged evidence → funds auto-release → each step
// appends an immutable entry to the blockchain-style audit ledger.
export function EscrowPage() {
  const { escrow, ledger, verifyMilestone, releaseMilestone, reset } = useStore()

  const summary = useMemo(() => {
    const total = escrow.reduce((s, m) => s + m.weight, 0)
    const releasedW = escrow.filter((m) => m.status === 'released').reduce((s, m) => s + m.weight, 0)
    const verifyingW = escrow.filter((m) => m.status === 'verifying').reduce((s, m) => s + m.weight, 0)
    const lockedW = total - releasedW - verifyingW
    // Contract value scales from the 15% mobilisation = Rp 0.9 M baseline.
    const contractValue = 6000000
    return {
      total,
      releasedPct: Math.round((releasedW / total) * 100),
      verifyingPct: Math.round((verifyingW / total) * 100),
      lockedPct: Math.round((lockedW / total) * 100),
      releasedRp: Math.round((releasedW / total) * contractValue),
      contractValue,
      escrowBalance: contractValue - Math.round((releasedW / total) * contractValue),
    }
  }, [escrow])

  return (
    <section className="mk-section">
      <div className="mk-container">
        <span className="mk-kicker">Escrow Control Center</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 28, color: 'var(--km-ink)', margin: '8px 0 4px' }}>Milestone-linked escrow</h1>
            <p style={{ color: 'var(--km-muted)', maxWidth: 560, margin: 0 }}>Project <b>RFQ-2041 · Tugboat 2,400 HP</b> · Operator <b>KSO Yard Makassar</b>. Funds release only when physical progress is verified via geo-tagged evidence.</p>
          </div>
          <button className="mk-btn mk-btn-ghost" onClick={reset}>↺ Reset demo</button>
        </div>

        {/* FUND FLOW BAR */}
        <div className="mk-panel" style={{ marginTop: 22 }}>
          <div className="mk-panel-head"><h3>Fund flow</h3><span className="mk-tag">🔒 Secured by third-party escrow</span></div>
          <div className="mk-fundbar" role="img" aria-label="Escrow fund split">
            <span className="seg released" style={{ width: summary.releasedPct + '%' }}>{summary.releasedPct}%</span>
            <span className="seg verifying" style={{ width: summary.verifyingPct + '%' }}>{summary.verifyingPct ? summary.verifyingPct + '%' : ''}</span>
            <span className="seg locked" style={{ width: summary.lockedPct + '%' }}>{summary.lockedPct}%</span>
          </div>
          <div className="mk-fund-legend">
            <span><i className="dot released" />Released</span>
            <span><i className="dot verifying" />Verifying</span>
            <span><i className="dot locked" />Locked in escrow</span>
          </div>
          <div className="mk-info-list" style={{ marginTop: 16 }}>
            <div><small>Contract value</small><b>Rp 6.00 M</b></div>
            <div><small>Released to yard</small><b style={{ color: 'var(--km-green)' }}>Rp {(summary.releasedRp / 1e6).toFixed(2)} M</b></div>
            <div><small>Escrow balance</small><b>Rp {(summary.escrowBalance / 1e6).toFixed(2)} M</b></div>
            <div><small>Milestones</small><b>{escrow.length}</b></div>
          </div>
        </div>

        {/* MILESTONE FLOW — verify evidence → auto-release */}
        <div className="mk-panel" style={{ marginTop: 22 }}>
          <div className="mk-panel-head"><h3>Milestone flow</h3><span className="mk-tag">Verify → auto-release</span></div>
          <p style={{ color: 'var(--km-muted)', fontSize: 13, marginTop: 0 }}>Submit geo-tagged evidence for a locked milestone, then release its funds. Every step appends an immutable block to the ledger below.</p>
          {escrow.map((m) => (
            <div className={`mk-ms ${m.status}`} key={m.id}>
              <span className="mk-ms-dot">{statusMeta[m.status].icon}</span>
              <div className="mk-ms-info">
                <b>{m.name}</b>
                <small>Weight {m.weight}% · {m.amount}{m.date && m.date !== '—' ? ` · completed ${m.date}` : ''}</small>
                {m.evidence && <small className="mk-ms-evidence">📍 geo-tagged {m.evidence.lat}, {m.evidence.lon} · {m.evidence.when}</small>}
              </div>
              <div className="mk-ms-right" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
                <span className={`mk-ms-status ${m.status}`}>{statusMeta[m.status].label}</span>
                {m.status === 'locked' && (
                  <button className="mk-btn mk-btn-outline" style={{ fontSize: 12, padding: '6px 13px' }} onClick={() => verifyMilestone(m.id)}>📍 Verify evidence</button>
                )}
                {m.status === 'verifying' && (
                  <button className="mk-btn mk-btn-primary" style={{ fontSize: 12, padding: '6px 13px' }} onClick={() => releaseMilestone(m.id)}>Release {m.amount}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AUDIT LEDGER — hash-chained */}
        <div className="mk-panel" style={{ marginTop: 22 }}>
          <div className="mk-panel-head"><h3>Audit ledger</h3><span className="mk-tag">⛓️ {ledger.length} blocks</span></div>
          <p style={{ color: 'var(--km-muted)', fontSize: 13, marginTop: 0 }}>Immutable, hash-chained record of every escrow event. The production build anchors the chain on a real distributed ledger.</p>
          <div className="mk-ledger">
            {[...ledger].reverse().map((e) => (
              <div className="mk-ledger-block" key={e.tx}>
                <div className="mk-ledger-head">
                  <span className="blk">#{String(e.block).padStart(2, '0')}</span>
                  <span className={`act ${e.action === 'FUNDS_RELEASED' ? 'rel' : 'ver'}`}>{e.action.replace(/_/g, ' ')}</span>
                </div>
                <div className="mk-ledger-body">
                  <b>{e.milestone}</b>
                  <small>{e.actor} · {e.geo} · {e.when}{e.amount && e.amount !== '—' ? ` · ${e.amount}` : ''}</small>
                </div>
                <code className="mk-ledger-tx">tx {e.tx} <span className="prev">⇢ prev {String(e.prev).slice(0, 10)}…</span></code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
