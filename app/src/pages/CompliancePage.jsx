import { useState } from 'react'
import { regulations, siupalTypes, bkiSurveys, statutoryCerts, validateImo } from '../data/compliance.js'

const TABS = [
  ['siupal', '📜', 'SIUPAL License'],
  ['imo', '🔢', 'IMO Number'],
  ['bki', '🛡️', 'BKI Class & Statutory'],
]

export function CompliancePage() {
  const [tab, setTab] = useState('imo')

  return (
    <>
      <section className="mk-page-head">
        <div className="mk-container">
          <span className="mk-kicker" style={{ color: '#ffb27a' }}>Compliance &amp; Verification Center</span>
          <h1>Trust, backed by regulation.</h1>
          <p>Every SIUPAL holder, IMO number and BKI certificate on the Hub is checked against Indonesian law and international maritime instruments. Verify a number yourself below.</p>
          <div className="mk-how-tabs" style={{ justifyContent: 'flex-start', marginTop: 20 }}>
            {TABS.map(([id, icon, label]) => (
              <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{icon} {label}</button>
            ))}
          </div>
        </div>
      </section>

      {tab === 'imo' && <ImoValidator />}
      {tab === 'siupal' && <SiupalPanel />}
      {tab === 'bki' && <BkiPanel />}

      <section className="mk-section mk-section-alt">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Legal grounding</span>
            <h2>Regulations we verify against</h2>
            <p>Indonesian law and international conventions underpinning the Hub's trust layer.</p>
          </div>
          <div className="mk-reg-grid">
            {regulations.map(r => (
              <div className="mk-reg-card" key={r.id}>
                <div className="mk-reg-top">
                  <span className={`mk-scope ${r.scope.toLowerCase()}`}>{r.scope}</span>
                  <code>{r.code}</code>
                </div>
                <b>{r.title}</b>
                <small>{r.body}</small>
                <p>{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )

// ---- IMO Number validator (interactive) -----------------------------------
function ImoValidator() {
  const [input, setInput] = useState('')
  const result = input.trim() ? validateImo(input) : null

  return (
    <section className="mk-section">
      <div className="mk-container">
        <div className="mk-validator">
          <div className="mk-validator-left">
            <h2>IMO Number check-digit validator</h2>
            <p className="mk-v-sub">The 7th digit is a <b>check digit</b>: multiply the first six digits by 7,6,5,4,3,2, sum them, and take the last digit. If it equals the 7th digit, the number is internally consistent.</p>
            <label>Enter an IMO number</label>
            <div className="mk-v-input">
              <span>IMO</span>
              <input inputMode="numeric" placeholder="8814275" value={input} onChange={(e) => setInput(e.target.value)} />
              <button className="mk-btn mk-btn-primary" type="button" onClick={() => setInput(input)}>Validate</button>
            </div>
            <div className="mk-v-samples">
              <small>Try:</small>
              <button onClick={() => setInput('8814275')}>8814275 (valid)</button>
              <button onClick={() => setInput('9319466')}>9319466 (valid)</button>
              <button onClick={() => setInput('8814274')}>8814274 (bad check)</button>
            </div>

            {result && (
              <div className={`mk-v-result ${result.ok ? 'ok' : 'bad'}`}>
                <div className="mk-v-result-head">
                  <span className="ic">{result.ok ? '✅' : '⚠️'}</span>
                  <b>{result.ok ? 'Valid check digit' : 'Invalid IMO number'}</b>
                </div>
                <p>{result.message}</p>
              </div>
            )}
          </div>

          {result && result.ok !== undefined && result.reason !== 'length' ? (
            <div className="mk-validator-right">
              <h3>Step-by-step calculation</h3>
              <table className="mk-calc">
                <thead><tr><th>Digit</th><th>Weight</th><th>Product</th></tr></thead>
                <tbody>
                  {result.breakdown.map((r, i) => (
                    <tr key={i}><td>{r.digit}</td><td>× {r.weight}</td><td>{r.product}</td></tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={2}>Sum</td><td>{result.total}</td></tr>
                  <tr><td colSpan={2}>Sum mod 10 → check digit</td><td>{result.calcCheck}</td></tr>
                  <tr className={result.ok ? 'ok' : 'bad'}><td colSpan={2}>7th digit provided</td><td>{result.providedCheck}</td></tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="mk-validator-right mk-validator-empty">
              <div className="ic">🧮</div>
              <p>Enter a 7-digit number to see the live check-digit breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}


// ---- SIUPAL panel ---------------------------------------------------------
function SiupalPanel() {
  return (
    <section className="mk-section">
      <div className="mk-container">
        <div className="mk-panel-head" style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 22 }}>SIUPAL — Surat Izin Usaha Pelayaran</h2>
        </div>
        <p style={{ color: 'var(--km-muted)', maxWidth: 720, marginTop: 0 }}>The shipping-business licence issued under <b>UU No. 17/2008</b> and administered through the Ministry of Transportation. Only a valid SIUPAL holder may operate or charter vessels on Indonesian routes. The Hub requires SIUPAL verification before an owner can post an RFQ or win a bid.</p>
        <div className="mk-siupal-grid">
          {siupalTypes.map(t => (
            <div className="mk-siupal-card" key={t.code}>
              <code>{t.code}</code>
              <b>{t.label}</b>
              <small>{t.sub}</small>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="mk-escrow-note" style={{ marginTop: 22 }}>
          <span className="ic">🏛️</span>
          <div><b>Indonesia-flagged (Bendera Merah Putih) policy</b><p>Cabotage under UU 17/2008 reserves domestic routes to Indonesian-flagged vessels operated by SIUPAL holders. SIUPAL holders are further registered with <b>SISWALAKSANA</b> (the Ministry's ship &amp; crew database).</p></div>
        </div>
      </div>
    </section>
  )
}

// ---- BKI panel ------------------------------------------------------------
function BkiPanel() {
  return (
    <section className="mk-section">
      <div className="mk-container">
        <div className="mk-panel-head" style={{ marginBottom: 8 }}>
          <h2 style={{ fontSize: 22 }}>BKI — Biro Klasifikasi Indonesia</h2>
          <span className="mk-tag">IACS Member Society</span>
        </div>
        <p style={{ color: 'var(--km-muted)', maxWidth: 760, marginTop: 0 }}>BKI is Indonesia's national classification society and a member of the <b>IACS</b>. As a Recognized Organization it acts on behalf of the Indonesian flag state to perform class <i>and</i> statutory surveys. Every partner yard and vessel on the Hub must hold current BKI class + statutory certificates.</p>

        <h3 className="mk-sub-h">Classification survey cycle</h3>
        <div className="mk-table-wrap">
          <table className="mk-table">
            <thead><tr><th>Survey</th><th>Interval</th><th>Scope</th><th>Purpose</th></tr></thead>
            <tbody>
              {bkiSurveys.map(s => (
                <tr key={s.name}><td><b>{s.name}</b></td><td>{s.cycle}</td><td>{s.scope}</td><td>{s.target}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mk-sub-h">Statutory certificates BKI issues (as Recognized Organization)</h3>
        <div className="mk-cert-grid">
          {statutoryCerts.map(c => (
            <div className="mk-cert-tile" key={c.name}>
              <span className="ic">📄</span>
              <b>{c.name}</b>
              <code>{c.ref}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

}
