import { useState } from 'react'
import { href } from '../router.js'
import { tierCriteria, verificationStages, requiredDocs, suggestTier } from '../data/onboarding.js'
import { useStore } from '../store-context.js'

const STEPS = ['Legal identity', 'Documents', 'Capacity matrix', 'Review & submit']

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    company: '', noktp: '', contact: '', email: '', phone: '',
    city: '', siup: '', siupal: '', tax: '',
    dockLength: '', dockBreadth: '', gravingDocks: '', crane: '', maxDraft: '',
    specialties: [], years: '',
  })
  const [docs, setDocs] = useState({})
  const [createdId, setCreatedId] = useState(null)
  const { joinYard } = useStore()
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const toggleSpecialty = (id) => setForm(f => ({ ...f, specialties: f.specialties.includes(id) ? f.specialties.filter(s => s !== id) : [...f.specialties, id] }))
  const submit = () => {
    const yard = joinYard({ form, docs })
    setCreatedId(yard.id)
    setDone(true)
  }

  const cats = [
    { id: 'repair', icon: '🛠️', label: 'Repair & Docking' },
    { id: 'newbuild', icon: '🚢', label: 'New Build' },
    { id: 'conversion', icon: '⚙️', label: 'Conversion' },
    { id: 'steel', icon: '🏗️', label: 'Steel' },
    { id: 'engine', icon: '🔧', label: 'Engine' },
    { id: 'survey', icon: '🔍', label: 'Survey' },
  ]

  const mandatoryDone = requiredDocs.filter(d => d.mandatory).every(d => docs[d.id])
  const tier = suggestTier({ dockLength: Number(form.dockLength) || 0, gravingDocks: Number(form.gravingDocks) || 0, hasIso: !!docs.iso, hasBki: !!docs.bki })
  const tierInfo = tierCriteria.find(t => t.tier === tier.tier)

  const canContinue = step === 0 ? (form.company && form.siup && form.contact) : step === 1 ? mandatoryDone : step === 2 ? (form.dockLength && form.gravingDocks && form.specialties.length) : true


  if (done) {
    return (
      <section className="mk-section">
        <div className="mk-container" style={{ maxWidth: 760 }}>
          <div className="mk-panel" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 52 }}>🎉</div>
            <h2 style={{ fontSize: 26 }}>Application received — {form.company || 'Your yard'}</h2>
            <p style={{ color: 'var(--km-muted)', maxWidth: 520, margin: '0 auto 6px' }}>
              Your profile entered the Kalimas verification pipeline. A dedicated operator will confirm your documents within 2 business days.
            </p>
            <span className={`mk-tier ${tier.tier.toLowerCase()}`} style={{ position: 'static', display: 'inline-block', marginTop: 10 }}>Provisional tier: {tier.tier} · score {tier.score}/100</span>

            <div style={{ textAlign: 'left', marginTop: 28 }}>
              <div className="mk-panel-head"><h3>Verification pipeline</h3></div>
              {verificationStages.map((s, i) => (
                <div className={`mk-ms ${i === 0 ? 'verifying' : i === 1 ? 'verifying' : ''}`} key={s.id}>
                  <span className="mk-ms-dot">{i <= 1 ? '⏳' : '○'}</span>
                  <div className="mk-ms-info">
                    <b>{s.icon} {s.label}</b>
                    <small>{s.desc}</small>
                  </div>
                  <div className="mk-ms-right">
                    <span className={`mk-ms-status ${i <= 1 ? 'verifying' : ''}`}>{i === 0 ? 'In review' : i === 1 ? 'In review' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 26 }}>
              {createdId && <a className="mk-btn mk-btn-primary" href={href(`/yard/${createdId}`)}>View my profile</a>}
              <a className="mk-btn mk-btn-ghost" href={href('/directory')}>See live directory</a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mk-section">
      <div className="mk-container" style={{ maxWidth: 860 }}>
        <span className="mk-kicker">Partner onboarding</span>
        <h1 style={{ fontSize: 28, color: 'var(--km-ink)', margin: '8px 0 4px' }}>Join as a verified shipyard</h1>
        <p style={{ color: 'var(--km-muted)' }}>Four steps to join the Kalimas network. Kalimas handles the customer, escrow and coordination — you focus on the steel.</p>

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


          {step === 0 && (
            <>
              <div className="mk-panel-head"><h3>Legal identity</h3><span className="mk-tag">⚖️ OSS-RBA</span></div>
              <div className="mk-form-grid">
                <label>Company / yard name *<input value={form.company} onChange={set('company')} placeholder="PT Galangan Anda" /></label>
                <label>SIUP number *<input value={form.siup} onChange={set('siup')} placeholder="503/xxx/DPMPTSP" /></label>
                <label>Primary contact *<input value={form.contact} onChange={set('contact')} placeholder="Nama PIC" /></label>
                <label>Business email<input value={form.email} onChange={set('email')} placeholder="pic@galangan.co.id" /></label>
                <label>Phone / WhatsApp<input value={form.phone} onChange={set('phone')} placeholder="+62 8xx" /></label>
                <label>SIUPAL (if held)<input value={form.siupal} onChange={set('siupal')} placeholder="SIUPAL-xxxx" /></label>
                <label>City / province<input value={form.city} onChange={set('city')} placeholder="Balikpapan, Kaltim" /></label>
                <label>Years in operation<input value={form.years} onChange={set('years')} placeholder="12" /></label>
              </div>
              <div className="mk-escrow-note" style={{ marginTop: 16 }}>
                <span className="ic">🔒</span>
                <div><b>Why we verify</b><p>Every partner is checked against OSS-RBA (NIB/SIUP) so buyers on the Hub transact only with licensed entities. Payments remain escrow-protected throughout.</p></div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="mk-panel-head"><h3>Upload compliance documents</h3><span className="mk-tag">🎖️ BKI · ISO</span></div>
              <p style={{ color: 'var(--km-muted)', fontSize: 13.5, marginTop: 0 }}>Mandatory: NIB, NPWP, SIUP and BKI Class Certificate. ISO and recent surveys strengthen your tier.</p>
              <div className="mk-doc-grid">
                {requiredDocs.map(d => (
                  <label key={d.id} className={`mk-doc-tile ${docs[d.id] ? 'uploaded' : ''}`}>
                    <input type="checkbox" checked={!!docs[d.id]} onChange={(e) => setDocs({ ...docs, [d.id]: e.target.checked })} />
                    <div className="mk-doc-body">
                      <b>{d.label} {d.mandatory && <span className="mk-req">required</span>}</b>
                      <small>{d.detail}</small>
                    </div>
                    <span className="mk-doc-state">{docs[d.id] ? '✓ Attached' : '＋ Attach'}</span>
                  </label>
                ))}
              </div>
              {!mandatoryDone && <p style={{ color: 'var(--km-orange)', fontSize: 13, marginTop: 12 }}>⚠ Attach all required documents to continue.</p>}
              <p style={{ color: 'var(--km-muted)', fontSize: 12.5, marginTop: 8 }}>Demo: tick to simulate an upload. Production stores files to encrypted object storage & verifies BKI membership via API.</p>
            </>
          )}


          {step === 2 && (
            <>
              <div className="mk-panel-head"><h3>Capacity matrix</h3><span className="mk-tag">📐 Drives AI matching</span></div>
              <p style={{ color: 'var(--km-muted)', fontSize: 13.5, marginTop: 0 }}>These figures power the AI matchmaking engine that routes RFQs to your open slots.</p>
              <div className="mk-form-grid">
                <label>Dock length (m) *<input value={form.dockLength} onChange={set('dockLength')} placeholder="165" /></label>
                <label>Dock breadth (m) *<input value={form.dockBreadth} onChange={set('dockBreadth')} placeholder="30" /></label>
                <label>Graving docks *<input value={form.gravingDocks} onChange={set('gravingDocks')} placeholder="2" /></label>
                <label>Max draft (m)<input value={form.maxDraft} onChange={set('maxDraft')} placeholder="8" /></label>
                <label style={{ gridColumn: '1 / -1' }}>Crane capacity<input value={form.crane} onChange={set('crane')} placeholder="1 × 200 ton" /></label>
              </div>
              <label style={{ display: 'block', marginTop: 14, fontWeight: 700, color: 'var(--km-ink)' }}>Specialties *</label>
              <div className="mk-spec-picker">
                {cats.map(c => (
                  <button key={c.id} type="button" className={`mk-spec-chip ${form.specialties.includes(c.id) ? 'selected' : ''}`} onClick={() => toggleSpecialty(c.id)}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
              <div className="mk-tier-preview">
                <div><small>Provisional tier</small><b className={`mk-tier ${tier.tier.toLowerCase()}`}>{tier.tier}</b></div>
                <div><small>Match score</small><b>{tier.score}/100</b></div>
                <div><small>Qualified for</small><b>{(tierInfo ? tierInfo.perks : []).length} partner perks</b></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mk-panel-head"><h3>Review & submit</h3><span className="mk-tag">{tier.tier} · {tier.score}/100</span></div>
              <div className="mk-info-list">
                <div><small>Company</small><b>{form.company || '—'}</b></div>
                <div><small>SIUP</small><b>{form.siup || '—'}</b></div>
                <div><small>Contact</small><b>{form.contact || '—'}</b></div>
                <div><small>Location</small><b>{form.city || '—'}</b></div>
                <div><small>Dock LOA / breadth</small><b>{form.dockLength || '—'} / {form.dockBreadth || '—'} m</b></div>
                <div><small>Graving docks</small><b>{form.gravingDocks || '—'}</b></div>
                <div><small>Crane</small><b>{form.crane || '—'}</b></div>
                <div><small>Years active</small><b>{form.years || '—'}</b></div>
              </div>
              <div style={{ marginTop: 12 }}>
                <small style={{ color: 'var(--km-muted)' }}>Specialties</small>
                <div className="mk-tags">{form.specialties.map(s => { const c = cats.find(x => x.id === s); return <span key={s} className="mk-tag">{c ? c.icon + ' ' + c.label : s}</span> })}</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <small style={{ color: 'var(--km-muted)' }}>Documents attached</small>
                <div className="mk-tags">{requiredDocs.filter(d => docs[d.id]).map(d => <span key={d.id} className="mk-tag">✓ {d.label}</span>)}</div>
              </div>
              {tierInfo && (
                <div className="mk-escrow-note" style={{ marginTop: 16 }}>
                  <span className="ic">🏅</span>
                  <div><b>{tier.tier} partner perks</b><p>{tierInfo.perks.join(' · ')}</p></div>
                </div>
              )}
            </>
          )}

          {/* Wizard nav */}
          <div className="mk-wizard-nav">
            <button className="mk-btn mk-btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
            {step < STEPS.length - 1 ? (
              <button className="mk-btn mk-btn-primary" disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue →</button>
            ) : (
              <button className="mk-btn mk-btn-primary" onClick={submit}>🚀 Submit application</button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
