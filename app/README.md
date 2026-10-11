# Kalimas Shipyard Hub (KSH) — Frontend

Maritime B2B marketplace connecting ship owners & SIUPAL holders with a nationwide network
of verified shipyards. Digital extension of **www.kalimasgroup.com**, operated from
**Balikpapan**.

> **Full architecture & API-integration blueprint → [`../ARCHITECTURE.md`](../ARCHITECTURE.md).**
> This README covers running the app only.

## Stack
React 18 + Vite + a dependency-free hash router and a mock-BFF store (persisted to
`localStorage`). No UI/backend framework — intentionally minimal so the whole prototype
runs with `npm install && npm run dev`.

## Run
```bash
npm install     # first time only
npm run dev     # dev server → http://localhost:5173
npm run lint    # oxlint
npm run build   # production build → dist/
npm run preview # preview the build
```

## Routes
`#/` home · `#/directory` shipyards · `#/yard/:id` · `#/rfq` board · `#/rfq/:id` (bidding) ·
`#/post` RFQ wizard · `#/compliance` SIUPAL/IMO/BKI · `#/onboarding` · `#/dashboard` ·
`#/escrow` control center · `#/launch` invitation.

## Demo data
All state lives in `localStorage` (key `ksh_store_v1`), seeded from `src/data/catalog.js`.
Every transaction is simulated. Use the **Reset** action in the dashboard to restore the seed.
