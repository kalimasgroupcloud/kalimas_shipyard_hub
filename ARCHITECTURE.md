# Kalimas Shipyard Hub (KSH) — Architecture & Integration Blueprint

> Digital extension of **www.kalimasgroup.com**. Based in **Balikpapan** (gateway to IKN),
> operating as a **Project Operator & Customer Aggregator** that connects ship owners and
> **SIUPAL** holders with a nationwide network of verified shipyards.
>
> Status: **functional demo prototype** (frontend-only, mock BFF). Not yet for operational
> payments — every escrow/ledger action is simulated. See "Path to production" below.

---

## 1. Platform map (current, live)

The app is a **zero-runtime-dependency React SPA** (Vite + React 18, oxlint). It runs without
any backend today by using a **mock BFF** (a global React store persisted to `localStorage`).

### Routes (hash-router — `src/router.js`)

| Route | Page | Purpose |
|-------|------|---------|
| `#/` | `HomePage` | Marketplace landing: hero, live RFQ feed, categories, featured yards, testimonials |
| `#/directory` | `DirectoryPage` | Shipyard catalog with filters (service, tier, capacity, search) |
| `#/yard/:id` | `YardDetailPage` | Yard profile: dock specs, certifications, capacity, related yards |
| `#/rfq` | `RfqBoardPage` | Open Requests for Quote, filterable by project type |
| `#/rfq/:id` | `RfqDetailPage` | RFQ detail + **AI matchmaking** + **Real-Time Dynamic Bidding Dashboard** + bid form |
| `#/post` | `PostRfqPage` | **Smart Predictive RFQ Wizard** (4 steps, simulated CAD/AI spec extraction) |
| `#/compliance` | `CompliancePage` | **Compliance & Verification Center**: SIUPAL classes, IMO check-digit validator, BKI/IACS survey tables |
| `#/onboarding` | `OnboardingPage` | Yard partner registration wizard with auto tier suggestion |
| `#/dashboard` | `DashboardPage` | Operator workspace: projects, bids, escrow, AI capacity matrix |
| `#/escrow` | `EscrowPage` | **Escrow Control Center**: milestone verify/release + blockchain-style audit ledger |
| `#/launch` | `LaunchPage` | **Digital Launching Invitation**: formal letter, agenda, founding-member tiers, RSVP |

### State layer — mock BFF (`src/store.jsx`, `src/store-context.js`)

A single React context (`useStore()`) seeded from `src/data/catalog.js` and mirrored to
`localStorage` under key **`ksh_store_v1`**. A `reset()` action wipes local changes.

**State shape**
```js
{
  shipyards: Yard[],   // catalog + yards joined via onboarding
  rfqs: Rfq[],         // catalog + RFQs created via the wizard; each may have bidList[]
  escrow: Milestone[], // milestone-linked payment plan for the active project
  ledger: LedgerBlock[], // immutable audit chain (pseudo-hash linked)
  rsvps: Rsvp[]        // launch-invitation registrations (seat no. assigned)
}
```

**Actions (the API surface to replace 1:1)**
| Action | Signature | Current behaviour | Future REST call |
|--------|-----------|-------------------|------------------|
| `createRfq` | `({ form, specialties, spec }) => Rfq` | Appends RFQ, returns record | `POST /api/rfqs` |
| `joinYard` | `(form) => Yard` | Appends verified yard w/ auto tier | `POST /api/shipyards` |
| `addBid` | `(rfqId, bid) => void` | Bumps bid count, prepends to `bidList` | `POST /api/rfqs/:id/bids` |
| `addRsvp` | `(entry) => Rsvp` | Assigns seat no. `KSH-###` | `POST /api/launch/rsvp` |
| `verifyMilestone` | `(id) => void` | Simulates geo-tagged evidence, appends ledger block | `POST /api/escrow/:id/verify` |
| `releaseMilestone` | `(id) => void` | Marks released, appends `FUNDS_RELEASED` block | `POST /api/escrow/:id/release` |
| `reset` | `() => void` | Clears storage, restores seed | — (demo only) |

> The ledger uses a deterministic `pseudoHash` (FNV-style) so blocks chain believably
> **without** a crypto dependency. **On the real BFF, replace with `keccak256` (or the

---

## 2. Data model (contract for the backend)

```
Shipyard { id, name, location, established, tier: Gold|Silver|Bronze,
           verified, rating, reviews, dockLength, dockBreadth, crane,
           gravingDocks, capacity: { used, total }, specialties: CategoryId[],
           certifications: string[], score, responseTime, projectsDone, blurb }

Rfq      { id, type: repair|newbuild|conversion|steel|engine|survey,
           title, vessel, loa, location, budget, tags[], summary,
           owner, siupal, verified, postedAgo, bids, deadline,
           bidList: Bid[] }
Bid      { yard, price, duration, warranty, when, score? }

Milestone { id, name, weight, amount, status: released|verifying|locked,
            date, evidence?: { lat, lon, when } }
LedgerBlock { block, milestone, action, amount, when, actor, geo, tx, prev }
Rsvp     { name, org, role, email, seat, when }
```

Category ids: `repair, newbuild, conversion, steel, engine, survey`
(`src/data/catalog.js`). SIUPAL classes A–K and BKI/IACS survey reference data live in
`src/data/compliance.js`; the IMO validator implements the **real 7-digit check-digit
algorithm** (weights 7·6·5·4·3·2 → sum mod 10).

---

## 3. Integration targets

### 3.1 www.kalimasgroup.com ↔ Hub (secure API bridge)
- Deploy the Hub on a **sub-domain** (e.g. `hub.kalimasgroup.com`) behind the main site's
  auth, or expose a signed SSO hand-off.
- Introduce a thin **BFF** (Node/Edge) in front of the Hub so the SPA only ever calls
  same-origin `/api/*` — the BFF holds secrets and proxies to core services.
- Suggested headers: `Authorization: Bearer <JWT>` (from kalimasgroup.com SSO) + a
  `X-Idempotency-Key` on all mutating calls (create RFQ, bid, release funds).

### 3.2 Escrow provider (sandbox → production)
The demo escrow is local. Replace `verifyMilestone` / `releaseMilestone` with webhook-driven
flows:
```
1. Owner funds contract        → POST /escrow/accounts         (provider)
2. Surveyor uploads geo-tagged
   photo/video per milestone   → provider webhook → our /api/escrow/:id/verify
3. Provider releases term      → webhook → our /api/escrow/:id/release
   (append keccak256 ledger block, store provider receipt id)
```
**Hard rule for production:** never move funds without a verified milestone event AND dual
approval (operator + owner). Keep the ledger immutable and append-only.

### 3.3 Identity & compliance (SIUPAL / IMO / BKI)
- Backend must verify **SIUPAL** numbers against the operator registry and **IMO** numbers
  against the IMO/GISIS check-digit before marking a party `verified`.
- Shipyard onboarding should ingest **BKI / IACS** class certificates and survey status;
  the `CompliancePage` already surfaces the reference tables — wire them to real lookups.

---

## 4. Path to production (checklist)

- [ ] Stand up the BFF; port the 7 store actions to real endpoints (table in §1).
- [ ] Replace `pseudoHash` with `keccak256`; persist ledger server-side (append-only).
- [ ] Connect escrow provider sandbox; add idempotency + webhook signature verification.
- [ ] Add auth (SSO from kalimasgroup.com) and role-based access (owner / yard / operator).
- [ ] Move seed data (`catalog.js`) behind `GET /api/*`; keep it as dev fixture.
- [ ] Add server-side SIUPAL/IMO/BKI verification gates before `verified: true`.
- [ ] Add CI: `npm run lint` + `npm run build` on every PR (currently both green).
- [ ] Observability: request logging, escrow audit export, error tracking (e.g. Sentry).

---

## 5. Commands

```bash
cd app
npm run dev       # dev server (HMR)  → http://localhost:5173
npm run lint      # oxlint (currently 0 warnings / 0 errors)
npm run build     # production build  → app/dist
npm run preview   # preview the build
```

## 6. Scope & disclaimer

This is a **demo build**. All transactions, escrow movements, ledger entries, verifications
and RSVPs are **simulated locally** and must not drive operational or financial decisions.
Compliance data (SIUPAL classes, IMO algorithm, BKI/IACS survey types) reflects published
Indonesian & international maritime regulations but is provided for demonstration only.

> escrow provider's receipt hash).** Same input → same hash, which keeps tests stable.
