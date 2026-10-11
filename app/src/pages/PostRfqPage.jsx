import { useState } from 'react'
import { href } from '../router.js'
import { categories } from '../data/catalog.js'
import { useStore } from '../store-context.js'

// Smart Spec Sheets & 3D/CAD Ingestion — demo simulation.
// In production this is where the AI vision pipeline extracts specs from uploads.
const SAMPLE_EXTRACT = {
  loa: '82.0 m', breadth: '17.2 m', draft: '6.1 m', gt: '3,850 GT',
  vesselType: 'Platform Supply Vessel (PSV)', build: '2014',
}

const STEPS = ['Vessel & specs', 'Service scope', 'Budget & timeline', 'Review & submit']

export function PostRfqPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [spec, setSpec] = useState({ ...SAMPLE_EXTRACT, autoFilled: false })
  const [selected, setSelected] = useState([])
  const [form, setForm] = useState({
    owner: '', vessel: '', description: '', budget: '', duration: '', location: 'Balikpapan',
  })
  const [files, setFiles] = useState([])
  const [createdId, setCreatedId] = useState(null)
  const { createRfq } = useStore()

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = () => {
    const rfq = createRfq({ form, specialties: selected, spec })
    setCreatedId(rfq.id)
    setDone(true)
  }

  const toggleCat = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const simulateUpload = () => {
    setExtracting(true)
    setFiles(['VESSEL-BLUEPRINT-R2.dwg', 'REPAIR-LIST-2026.pdf'])
    // Simulate AI extraction latency, then auto-fill the spec sheet.
    setTimeout(() => {
      setExtracting(false)
      setSpec({ ...SAMPLE_EXTRACT, autoFilled: true })
    }, 1400)
  }

  const rfqId = createdId || 'RFQ-2042'

  if (done) {
    return (
      <section className="mk-section">
        <div className="mk-container" style={{ maxWidth: 720 }}>
          <div className="mk-panel" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 52 }}>🎉</div>
            <h2 style={{ fontSize: 24 }}>Your RFQ is live (demo)</h2>
            <p style={{ color: 'var(--km-muted)', maxWidth: 460, margin: '0 auto 8px' }}>
              Reference <b style={{ color: 'var(--km-ink)' }}>{rfqId}</b>. Kalimas Shipyard Hub is now matching your {form.vessel || 'vessel'} against verified shipyards with open capacity.
            </p>
            <div className="mk-escrow-note" style={{ textAlign: 'left', marginTop: 20 }}>
              <span className="ic">🔒</span>
              <div>
                <b>Escrow ready</b>
                <p>Once you award a bid, funds lock in escrow and release per verified milestone. No payment before verified progress.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
              <a className="mk-btn mk-btn-primary" href={href(`/rfq/${rfqId}`)}>View my RFQ</a>
              <a className="mk-btn mk-btn-ghost" href={href('/rfq')}>RFQ board</a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mk-section">
      <div className="mk-container" style={{ maxWidth: 820 }}>
        <span className="mk-kicker">Smart RFQ engine</span>
        <h1 style={{ fontSize: 28, color: 'var(--km-ink)', margin: '8px 0 4px' }}>Post a new project</h1>
        <p style={{ color: 'var(--km-muted)' }}>Upload technical docs and let AI map the scope — or fill in manually. Kalimas verifies your SIUPAL before going live.</p>

        {/* Stepper */}
        <div className="mk-wizard-steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`mk-wiz-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <span className="mk-wiz-num">{i < step ? '✓' : i + 1}</span>
              <span className="mk-wiz-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="mk-panel" style={{ marginTop: 20 }}>
          {/* STEP 1 — Vessel & specs */}
          {step === 0 && (
            <>
              <div className="mk-panel-head"><h3>Upload technical documents</h3><span className="mk-tag">🤖 AI extraction</span></div>
              <div className="mk-dropzone" onClick={simulateUpload}>
                {extracting ? (
                  <>
                    <div className="mk-spinner" />
                    <p>AI is reading your blueprint &amp; extracting specs…</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 34 }}>📄⚙️</div>
                    <b>Drop blueprints, CAD or repair lists</b>
                    <p>.dwg · .step · .pdf · .xlsx — we auto-extract LOA, breadth, draft &amp; GT</p>
                    <span className="mk-btn mk-btn-outline" style={{ marginTop: 12 }}>Choose files (demo)</span>
                  </>
                )}
              </div>
              {files.length > 0 && !extracting && (
                <div className="mk-tags" style={{ marginTop: 12 }}>
                  {files.map(f => <span key={f} className="mk-tag">📎 {f}</span>)}
                </div>
              )}

              {spec.autoFilled && (
                <div className="mk-escrow-note" style={{ marginTop: 16 }}>
                  <span className="ic">✨</span>
                  <div><b>Specs auto-filled from your documents</b><p>Review and adjust below — the matchmaking engine uses these values.</p></div>
                </div>
              )}

              <div className="mk-form-grid" style={{ marginTop: 16 }}>
                <label>Company / owner name
                  <input value={form.owner} onChange={set('owner')} placeholder="e.g. PT Pelayaran Nusantara" />
                </label>
                <label>Vessel type
                  <input value={spec.vesselType} onChange={(e) => setSpec({ ...spec, vesselType: e.target.value })} />
                </label>
                <label>Vessel name / ID
                  <input value={form.vessel} onChange={set('vessel')} placeholder="e.g. KM Nusantara 12" />
                </label>
                <label>LOA (m)
                  <input value={spec.loa} onChange={(e) => setSpec({ ...spec, loa: e.target.value })} />
                </label>
                <label>Breadth (m)
                  <input value={spec.breadth} onChange={(e) => setSpec({ ...spec, breadth: e.target.value })} />
                </label>
                <label>Draft (m)
                  <input value={spec.draft} onChange={(e) => setSpec({ ...spec, draft: e.target.value })} />
                </label>
                <label>Gross Tonnage
                  <input value={spec.gt} onChange={(e) => setSpec({ ...spec, gt: e.target.value })} />
                </label>
              </div>
            </>
          )}

          {/* STEP 2 — Service scope */}
          {step === 1 && (
            <>
              <div className="mk-panel-head"><h3>What do you need done?</h3><span className="mk-tag">{selected.length} selected</span></div>
              <div className="mk-cat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {categories.map(c => (
                  <div key={c.id} className={`mk-cat ${selected.includes(c.id) ? 'sel' : ''}`} onClick={() => toggleCat(c.id)}>
                    <div className="ic">{c.icon}</div>
                    <b>{c.label}</b>
                  </div>
                ))}
              </div>
              <label style={{ display: 'block', marginTop: 18 }}>Scope of work
                <textarea rows={4} value={form.description} onChange={set('description')} placeholder="Describe the repair list, survey class, or new-build requirements…" />
              </label>
            </>
          )}

          {/* STEP 3 — Budget & timeline */}
          {step === 2 && (
            <>
              <div className="mk-panel-head"><h3>Budget, location &amp; timeline</h3></div>
              <div className="mk-form-grid">
                <label>Budget range (IDR)
                  <input value={form.budget} onChange={set('budget')} placeholder="e.g. Rp 8 – 12 M" />
                </label>
                <label>Preferred location
                  <input value={form.location} onChange={set('location')} />
                </label>
                <label>Target duration
                  <input value={form.duration} onChange={set('duration')} placeholder="e.g. 30 days" />
                </label>
                <label>Bid deadline
                  <input type="date" defaultValue="2026-11-15" />
                </label>
              </div>
              <div className="mk-escrow-note" style={{ marginTop: 16 }}>
                <span className="ic">🔒</span>
                <div><b>Payments via Kalimas escrow</b><p>Your budget is held and released to the winning yard per verified physical milestone.</p></div>
              </div>
            </>
          )}

          {/* STEP 4 — Review */}
          {step === 3 && (
            <>
              <div className="mk-panel-head"><h3>Review your RFQ</h3></div>
              <div className="mk-info-list">
                <div><small>Owner</small><b>{form.owner || '—'}</b></div>
                <div><small>Vessel</small><b>{form.vessel || spec.vesselType}</b></div>
                <div><small>LOA</small><b>{spec.loa}</b></div>
                <div><small>Services</small><b>{selected.length ? selected.join(', ') : '—'}</b></div>
                <div><small>Budget</small><b>{form.budget || '—'}</b></div>
                <div><small>Location</small><b>{form.location}</b></div>
              </div>
              <p style={{ color: 'var(--km-muted)', fontSize: 13, marginTop: 14 }}>{form.description || 'No scope description provided.'}</p>
            </>
          )}

          {/* Wizard nav */}
          <div className="mk-wizard-nav">
            <button className="mk-btn mk-btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
            {step < STEPS.length - 1 ? (
              <button className="mk-btn mk-btn-primary" onClick={() => setStep(step + 1)}>Continue →</button>
            ) : (
              <button className="mk-btn mk-btn-primary" onClick={submit}>🚀 Publish RFQ</button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

