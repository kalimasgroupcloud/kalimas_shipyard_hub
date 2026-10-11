import { useState } from 'react'
import { StoreContext } from './store-context.js'
import { shipyards as seedYards, rfqs as seedRfqs, categories, escrowMilestones } from './data/catalog.js'
import { suggestTier } from './data/onboarding.js'

// KSH live store — a dependency-free "mock BFF" seeded from the static catalog.
// All marketplace entities (shipyards + RFQs) live here so that user actions
// (post an RFQ, join as a yard, place a bid) actually persist and propagate to
// every page. State is mirrored to localStorage so a refresh keeps it live.
// A future real API can replace the mutations 1:1 (createRfq/addBid/joinYard).

const STORAGE_KEY = 'ksh_store_v1'

// Deterministic pseudo-hash (hex) so the escrow audit ledger looks like a
// blockchain chain without pulling in crypto deps. Same input → same hash,
// which keeps SSR/tests stable. Replace with keccak256 on the real BFF.
function pseudoHash(input) {
  let h1 = 0x811c9dc5
  let h2 = 0x01000193
  for (let i = 0; i < input.length; i++) {
    h1 ^= input.charCodeAt(i)
    h1 = Math.imul(h1, 0x01000193) >>> 0
    h2 = (h2 + input.charCodeAt(i) * (i + 7)) >>> 0
    h2 = Math.imul(h2 ^ (h2 >>> 13), 0x5bd1e995) >>> 0
  }
  return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).slice(0, 16)
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && Array.isArray(parsed.shipyards) && Array.isArray(parsed.rfqs)) return parsed
    }
  } catch {
    /* corrupt or unavailable storage — fall back to seed */
  }
  // Seed the escrow ledger from the already-released catalog milestones so the
  // chain has a believable history on first load.
  const genesis = '0'.repeat(16)
  let prev = genesis
  const seededLedger = []
  escrowMilestones
    .filter((m) => m.status === 'released')
    .forEach((m, i) => {
      const entry = {
        block: i + 1,
        milestone: m.name,
        action: 'FUNDS_RELEASED',
        amount: m.amount,
        when: m.date,
        actor: 'Escrow Sandbox',
        geo: 'Balikpapan, ID',
        tx: pseudoHash(`${prev}|${m.id}|${m.amount}|${m.date}`),
        prev,
      }
      prev = entry.tx
      seededLedger.push(entry)
    })
  return { shipyards: seedYards, rfqs: seedRfqs, escrow: escrowMilestones, ledger: seededLedger, rsvps: [], user: null }
}

const catLabel = (id) => (categories.find((c) => c.id === id) || {}).label || id

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadInitial)

  // Persist on every change (best-effort; ignore quota / private-mode errors).
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }

  const nextRfqId = () => {
    const nums = state.rfqs.map((r) => parseInt(String(r.id).replace(/\D/g, ''), 10)).filter((n) => !isNaN(n))
    return 'RFQ-' + ((nums.length ? Math.max(...nums) : 2040) + 1)
  }

  const nextYardId = () => {
    const nums = state.shipyards.map((y) => parseInt(String(y.id).replace(/\D/g, ''), 10)).filter((n) => !isNaN(n))
    return 'SY-' + String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')
  }

  // Create an RFQ from the Smart RFQ wizard. Returns the created record so the
  // caller can navigate straight to its detail page.
  const createRfq = ({ form, specialties, spec }) => {
    const loa = Math.round(Number((spec && spec.loa) || form.loa || 0)) || 0
    const type = (specialties && specialties[0]) || 'repair'
    const specLabel = (specialties || []).map(catLabel).slice(0, 3)
    const rfq = {
      id: nextRfqId(),
      title: form.vessel ? `${form.vessel} — ${catLabel(type)}` : 'New project',
      owner: form.owner || 'Your Company',
      siupal: 'SIUPAL-2026-0001',
      verified: true,
      vessel: form.vessel || '—',
      loa,
      type,
      budget: form.budget || '—',
      location: form.location || '—',
      deadline: form.deadline || 'TBC',
      duration: form.duration || '',
      bids: 0,
      postedAgo: 'just now',
      summary: form.description || 'No scope description provided yet.',
      tags: specLabel.length ? specLabel : [catLabel(type)],
      spec: spec || null,
    }
    setState((s) => ({ ...s, rfqs: [rfq, ...s.rfqs] }))
    return rfq
  }

  // Register a shipyard from the onboarding wizard. Lands on the directory as
  // "pending verification" with an auto-suggested tier.
  const joinYard = ({ form, docs }) => {
    const id = nextYardId()
    const tier = suggestTier({
      dockLength: Number(form.dockLength) || 0,
      gravingDocks: Number(form.gravingDocks) || 0,
      hasIso: !!(docs && docs.iso),
      hasBki: !!(docs && docs.bki),
    })
    const certifications = []
    if (docs && docs.bki) certifications.push('BKI')
    if (docs && docs.iso) certifications.push('ISO 9001', 'ISO 45001')
    const yard = {
      id,
      name: form.company || 'New Shipyard',
      location: form.city || 'Indonesia',
      tier: tier.tier,
      score: tier.score,
      verified: false,
      pending: true,
      dockLength: Number(form.dockLength) || 0,
      dockBreadth: Number(form.dockBreadth) || 0,
      crane: form.crane || '—',
      gravingDocks: Number(form.gravingDocks) || 0,
      certifications: certifications.length ? certifications : ['BKI (pending)'],
      specialties: form.specialties || [],
      capacity: { used: 0, total: Math.max(40, (Number(form.gravingDocks) || 1) * 40) },
      rating: 0,
      reviews: 0,
      projectsDone: 0,
      responseTime: '< 24 hours',
      established: new Date().getFullYear(),
      blurb: `${form.company || 'This yard'} just joined the Kalimas network. Capacity matrix under verification.`,
    }
    setState((s) => ({ ...s, shipyards: [...s.shipyards, yard] }))
    return yard
  }

  // Record a bid on an RFQ and bump its bid counter.
  const addBid = (rfqId, bid) => {
    setState((s) => ({
      ...s,
      rfqs: s.rfqs.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              bids: (r.bids || 0) + 1,
              bidList: [{ ...bid, yard: bid.yard || 'Your Yard', when: 'just now' }, ...(r.bidList || [])],
            }
          : r,
      ),
    }))
  }

  // Record a launch-invitation RSVP (founding shipyard or ship owner).
  const addRsvp = (entry) => {
    const seat = 'KSH-' + String(state.rsvps.length + 1).padStart(3, '0')
    const record = { ...entry, seat, when: new Date().toLocaleString('id-ID') }
    setState((s) => ({ ...s, rsvps: [...s.rsvps, record] }))
    return record
  }

  // Demo helper: wipe local changes and restore the seed catalog.
  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setState({ shipyards: seedYards, rfqs: seedRfqs, escrow: escrowMilestones, ledger: [], rsvps: [] })
  }

  // Escrow flow: verify a milestone (geo-tagged evidence submitted) then release
  // its funds, appending an immutable entry to the audit ledger each step.
  const tailTx = () => {
    const last = state.ledger[state.ledger.length - 1]
    return last ? last.tx : '0'.repeat(16)
  }

  const pushLedger = (prev, entry) => {
    const block = state.ledger.length + 1
    const full = { block, ...entry, prev }
    full.tx = pseudoHash(`${prev}|${block}|${entry.action}|${entry.milestone}|${entry.when}`)
    return full
  }

  // Simulate geo-tagged photo/video evidence being uploaded for a milestone.
  const verifyMilestone = (id) => {
    const now = new Date().toISOString().slice(0, 10)
    const lat = (-1.2 + Math.random() * 2).toFixed(4)
    const lon = (116.8 + Math.random() * 2).toFixed(4)
    const entry = pushLedger(tailTx(), {
      milestone: id,
      action: 'EVIDENCE_VERIFIED',
      amount: '—',
      when: now,
      actor: 'Site Surveyor',
      geo: `${lat}, ${lon}`,
    })
    setState((s) => ({
      ...s,
      escrow: s.escrow.map((m) => (m.id === id ? { ...m, status: 'verifying', evidence: { lat, lon, when: now } } : m)),
      ledger: [...s.ledger, entry],
    }))
  }

  // Auto-release the milestone funds after verification (milestone-linked payout).
  const releaseMilestone = (id) => {
    const now = new Date().toISOString().slice(0, 10)
    setState((s) => {
      const target = s.escrow.find((m) => m.id === id)
      const entry = pushLedger(
        (s.ledger[s.ledger.length - 1] || {}).tx || '0'.repeat(16),
        {
          milestone: target ? target.name : id,
          action: 'FUNDS_RELEASED',
          amount: target ? target.amount : '—',
          when: now,
          actor: 'Escrow Sandbox',
          geo: 'Balikpapan, ID',
        },
      )
      return {
        ...s,
        escrow: s.escrow.map((m) => (m.id === id ? { ...m, status: 'released', date: now } : m)),
        ledger: [...s.ledger, entry],
      }
    })
  }

  // Demo auth — persists to localStorage via the store. A real build swaps
  // signIn for the kalimasgroup.com SSO handshake (see ARCHITECTURE.md §3.1).
  // Deliberately lenient: only an email (or a Google/OSS-RBA tap) is required.
  const signIn = (u) => {
    const user = { name: u.name || (u.email || '').split('@')[0] || 'Kalimas User', email: u.email || '', method: u.method || 'email', role: u.role || 'shipowner' }
    setState((s) => ({ ...s, user }))
    return user
  }

  const signOut = () => setState((s) => ({ ...s, user: null }))

  const value = { ...state, createRfq, joinYard, addBid, addRsvp, reset, verifyMilestone, releaseMilestone, signIn, signOut }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

