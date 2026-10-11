import { validateImo } from '../data/compliance.js'
import { href } from '../router.js'

// Verification panel shown on a shipyard profile.
// Three trust layers, each in its correct regulatory role:
//  1. BKI class approval  -> credential of the YARD
//  2. IMO numbers         -> identity of VESSELS it has serviced (live check-digit)
//  3. SIUPAL assurance    -> ship-owner licence Kalimas verifies before escrow
export function CompliancePanel({ yard, compliance }) {
  if (!compliance) return null
  const fleet = compliance.fleet || []

  return (
    <div className="mk-panel">
      <div className="mk-panel-head">
        <h3>Compliance &amp; class standing</h3>
        <a className="mk-tag" href={href('/compliance')} style={{ textDecoration: 'none' }}>Verify ↗</a>
      </div>

      {/* 1 — BKI yard approval */}
      <div className="mk-comp-row">
        <div className="mk-comp-badge bki">🏛️<div><b>BKI Class Approved</b><small>Company approval · {compliance.bkiApproval}</small></div></div>
        <div className="mk-comp-detail">
          <small>Last class audit</small>
          <b>{compliance.lastAudit}</b>
          <small style={{ marginTop: 8 }}>Workshop approval</small>
          <b>{compliance.workshopApproval}</b>
          <small style={{ marginTop: 8 }}>Class surveys hosted</small>
          <div className="mk-tags" style={{ marginTop: 4 }}>
            {compliance.approvedSurveys.map(s => <span key={s} className="mk-tag">{s}</span>)}
          </div>
        </div>
      </div>

      {/* 2 — Serviced vessels with live IMO check-digit */}
      {fleet.length > 0 && (
        <div className="mk-comp-row">
          <div className="mk-comp-subtitle">Vessels serviced — IMO identification</div>
          <div className="mk-comp-vessels">
            {fleet.map(v => {
              const r = validateImo(v.imo)
              return (
                <div className="mk-comp-vessel" key={v.imo}>
                  <div className="mk-comp-vessel-info">
                    <b>{v.name}</b>
                    <small>{v.type}</small>
                  </div>
                  <div className={`mk-imo-chip ${r.ok ? 'ok' : 'bad'}`} title={r.message}>
                    <span className="ic">{r.ok ? '✓' : '✕'}</span>
                    <span className="num">IMO {r.compact}</span>
                    <span className="lbl">{r.ok ? 'valid check-digit' : 'invalid'}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 3 — SIUPAL assurance (buyer-side) */}
      <div className="mk-comp-row">
        <div className="mk-escrow-note" style={{ marginTop: 0 }}>
          <span className="ic">📜</span>
          <div>
            <b>SIUPAL verified on the buyer side</b>
            <p>Every shipowner {yard.name} contracts with has their SIUPAL (shipping licence, UU No. 17/2008) verified by Kalimas before escrow opens. Class, funds and licence — all checked.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
