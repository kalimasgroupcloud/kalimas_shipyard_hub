import { useState } from 'react'
import { href } from '../router.js'
import { useStore } from '../store-context.js'

// Digital Launching Invitation — the official, persuasive invitation to
// shipyards and ship owners to join the Kalimas Shipyard Hub ecosystem at
// its launch event. RSVPs persist through the live store.
export function LaunchPage() {
  const { addRsvp, rsvps } = useStore()
  const [form, setForm] = useState({ name: '', org: '', role: 'shipyard', email: '', guests: 1 })
  const [confirmed, setConfirmed] = useState(null)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const rec = addRsvp(form)
    setConfirmed(rec)
  }

  const yardRsvps = rsvps.filter((r) => r.role === 'shipyard').length
  const ownerRsvps = rsvps.filter((r) => r.role === 'owner').length

  return (
    <>
      {/* HERO — official invitation */}
      <section className="lk-hero">
        <div className="lk-hero-glow" aria-hidden="true" />
        <div className="mk-container lk-hero-inner">
          <span className="lk-kicker">✦ Official Launching Invitation ✦</span>
          <h1>Kalimas Shipyard Hub<br /><em>Goes Live.</em></h1>
          <p className="lk-lead">
            You are formally invited to the launch of Indonesia's maritime delivery network — where
            320+ verified shipyards meet every SIUPAL holder, secured by escrow and orchestrated by Kalimas.
          </p>
          <div className="lk-hero-actions">
            <a className="lk-btn lk-btn-gold" href="#rsvp">Reserve your seat</a>
            <a className="lk-btn lk-btn-ghost" href={href('/directory')}>Preview the platform</a>
          </div>
          <div className="lk-meta">
            <div><small>Date</small><b>18 Desember 2026</b></div>
            <div><small>Venue</small><b>Ballroom, Hotel Four Points, Balikpapan</b></div>
            <div><small>Time</small><b>09.00 – 15.00 WITA</b></div>
            <div><small>Dress code</small><b>Maritime Smart</b></div>
          </div>
        </div>
      </section>

      {/* INVITATION LETTER */}
      <section className="mk-section">
        <div className="mk-container lk-letter">
          <div className="lk-letter-head">
            <img src="/kalimas-logo-transparent.png" alt="Kalimas" />
            <div>
              <b>PT Kalimas Group</b>
              <small>Balikpapan · Gateway to Indonesia's New Capital</small>
            </div>
          </div>
          <p className="lk-salut">Dengan hormat,</p>
          <p>
            Physical land may bound a shipyard, but it must never bound a network. From Balikpapan, Kalimas is
            turning that constraint into an advantage — assembling the largest digital maritime hub in the archipelago.
            <b> Kalimas Shipyard Hub</b> is our answer: a marketplace that connects <b>shipyards</b> seeking
            capacity with <b>ship owners &amp; SIUPAL holders</b> seeking execution, with escrow-secured,
            milestone-linked payments protecting every rupiah from award to delivery.
          </p>
          <p>
            On this occasion we do not merely launch a website. We open the doors to an ecosystem — and we are
            inviting the builders of Indonesia's maritime future to step through first, as <b>founding members</b>.
          </p>
          <p className="lk-sign">
            <b>Direksi PT Kalimas Group</b>
            <small>Ketua &amp; CEO</small>
          </p>
        </div>
      </section>

      {/* WHY ATTEND — dual audience */}
      <section className="mk-section mk-section-alt">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Why be in the room</span>
            <h2>Two audiences. One ecosystem.</h2>
            <p>Whether you build ships or sail them, the launch puts a verified network at your fingertips.</p>
          </div>
          <div className="lk-benefits">
            <div className="lk-benefit">
              <span className="ic">🏗️</span>
              <h3>For Shipyards</h3>
              <ul>
                <li>Win multi-project demand routed straight to your open docks.</li>
                <li>Kalimas handles the customer, contract &amp; coordination.</li>
                <li>Escrow guarantees you get paid per verified milestone.</li>
                <li>BKI / class certification showcases you to 1,850+ owners.</li>
              </ul>
            </div>
            <div className="lk-benefit">
              <span className="ic">🚢</span>
              <h3>For Ship Owners &amp; SIUPAL</h3>
              <ul>
                <li>Post once — AI matches your vessel to the right yard nationwide.</li>
                <li>Transparent competitive bidding, no single-source risk.</li>
                <li>Funds locked in escrow, released only on verified progress.</li>
                <li>No physical space needed — the network is infinite.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="mk-section">
        <div className="mk-container lk-agenda-wrap">
          <div className="mk-section-head">
            <span className="mk-kicker center">Run of show</span>
            <h2>Launch day agenda</h2>
          </div>
          <div className="lk-agenda">
            {[
              ['09.00', 'Registration & maritime networking breakfast', 'Foyer'],
              ['10.00', 'Opening — the Kalimas digital vision', 'Ballroom'],
              ['10.30', 'Live demo: post an RFQ → AI match → escrow lock', 'Ballroom'],
              ['12.00', 'Panel: scaling Indonesia\'s shipyard capacity', 'Ballroom'],
              ['13.30', 'Founding-member signing & partner handshake', 'Salon'],
              ['14.30', 'Shipyard & owner speed-matching session', 'Salon'],
            ].map(([time, title, place]) => (
              <div className="lk-agenda-row" key={time}>
                <span className="lk-time">{time}</span>
                <div className="lk-agenda-body">
                  <b>{title}</b>
                  <small>📍 {place}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDING MEMBER TIERS */}
      <section className="mk-section mk-section-alt">
        <div className="mk-container">
          <div className="mk-section-head">
            <span className="mk-kicker center">Founding member programme</span>
            <h2>Reserve at launch, lock in the early advantage</h2>
            <p>The first 50 verified partners receive launch-exclusive benefits for their first year on the Hub.</p>
          </div>
          <div className="lk-tiers">
            <div className="lk-tier">
              <b className="lk-tier-name">Founding Shipyard</b>
              <span className="lk-tier-tag">First 30 yards</span>
              <ul>
                <li>Featured listing for 6 months</li>
                <li>0% platform fee, first 3 projects</li>
                <li>Priority capacity-matrix placement</li>
                <li>Dedicated Kalimas account manager</li>
              </ul>
            </div>
            <div className="lk-tier lk-tier-featured">
              <span className="lk-tier-badge">Most sought</span>
              <b className="lk-tier-name">Charter Member</b>
              <span className="lk-tier-tag">First 50 partners</span>
              <ul>
                <li>Everything in Founding Shipyard</li>
                <li>Escrow fee waived, first year</li>
                <li>Founding plaque &amp; launch recognition</li>
                <li>Invite to closed Kalimas partner forum</li>
              </ul>
            </div>
            <div className="lk-tier">
              <b className="lk-tier-name">Founding Owner</b>
              <span className="lk-tier-tag">First 20 SIUPAL</span>
              <ul>
                <li>Free first RFQ with AI matching</li>
                <li>Dedicated project-operator support</li>
                <li>Early access to shipyard capacity slots</li>
                <li>Priority escrow onboarding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP — live, wired to the store */}
      <section className="lk-rsvp" id="rsvp">
        <div className="mk-container lk-rsvp-inner">
          <div className="lk-rsvp-copy">
            <span className="lk-kicker">RSVP</span>
            <h2>Reserve your seat</h2>
            <p>Confirm your attendance and lock your founding-member priority. Seats are limited to keep the room high-signal for real builders and owners.</p>
            <div className="lk-counter">
              <div><b>{yardRsvps}</b><small>Shipyards attending</small></div>
              <div><b>{ownerRsvps}</b><small>Owners attending</small></div>
              <div><b>{50 - rsvps.length}</b><small>Founding slots left</small></div>
            </div>
            <p className="lk-fine">A confirmation with your seat number will be emailed instantly. This is a demo — no data leaves your browser.</p>
          </div>

          <div className="lk-rsvp-card">
            {confirmed ? (
              <div className="lk-confirm">
                <div className="lk-confirm-check">✓</div>
                <h3>You're on the list, {confirmed.name.split(' ')[0]}!</h3>
                <div className="lk-seat">
                  <small>Seat number</small>
                  <b>{confirmed.seat}</b>
                </div>
                <p>
                  Registered as <b>{confirmed.role === 'shipyard' ? 'Founding Shipyard' : 'Ship Owner / SIUPAL'}</b>
                  {' '}for <b>{confirmed.guests}</b> {Number(confirmed.guests) === 1 ? 'guest' : 'guests'}.
                </p>
                <p className="lk-fine">Kalimas will follow up with venue details &amp; your onboarding checklist.</p>
                <a className="lk-btn lk-btn-gold lk-btn-block" href={confirmed.role === 'shipyard' ? href('/join') : href('/post')}>
                  {confirmed.role === 'shipyard' ? 'Start yard onboarding →' : 'Explore the platform →'}
                </a>
                <button className="lk-reset" onClick={() => { setConfirmed(null); setForm({ name: '', org: '', role: 'shipyard', email: '', guests: 1 }) }}>Register another guest</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3>Launch attendance</h3>
                <label>Full name
                  <input value={form.name} onChange={set('name')} placeholder="e.g. Budi Santoso" required />
                </label>
                <label>Company / Shipyard
                  <input value={form.org} onChange={set('org')} placeholder="e.g. PT Galangan Nusantara" required />
                </label>
                <label>I am attending as
                  <select value={form.role} onChange={set('role')}>
                    <option value="shipyard">Shipyard / builder</option>
                    <option value="owner">Ship owner / SIUPAL holder</option>
                  </select>
                </label>
                <label>Email
                  <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.co.id" required />
                </label>
                <label>Number of seats
                  <input type="number" min="1" max="5" value={form.guests} onChange={set('guests')} />
                </label>
                <button className="lk-btn lk-btn-gold lk-btn-block" type="submit">Confirm my seat</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="mk-cta">
        <div className="mk-container mk-cta-inner">
          <div>
            <h2>Can't make it on the 18th?</h2>
            <p>The doors of the Hub stay open. Register your interest and Kalimas will onboard you within 48 hours.</p>
          </div>
          <div className="actions">
            <a className="mk-btn mk-btn-white mk-btn-lg" href={href('/join')}>Join as shipyard</a>
            <a className="mk-btn mk-btn-translucent mk-btn-lg" href={href('/post')}>Post a project</a>
          </div>
        </div>
      </section>
    </>
  )
}


