# KSH — Roadmap 90 Hari (Eksekusi Tim IT)

> Fokus: fondasi yang bisa dipresentasikan saat peluncuran & mengundang mitra awal.

## Fase 1 — Fondasi (Minggu 1–2)
- [ ] Setup repo & CI/CD (build Vite + lint oxlint + deploy).
- [ ] Pecah `App.jsx` menjadi modul domain (RFQ, Matching, Bidding, Escrow, Dashboard).
- [ ] Provision database PostgreSQL + Redis + Object Storage (cloud Indonesia).
- [ ] **API Integration**: jembatan secure API antara www.kalimasgroup.com ↔ sub-domain Hub (SSO awal).

## Fase 2 — Core (Minggu 3–6)
- [ ] Sistem **Registrasi & Verifikasi** (SIUPAL + sertifikasi shipyard) + tier.
- [ ] **Escrow Sandbox**: uji transaksi dummy dengan mitra perbankan/fintech.
- [ ] Modul **Vessel & Spec** + ingestion dokumen dasar.
- [ ] Model data: users, tenants, projects, milestones, contracts.

## Fase 3 — RFQ & Matchmaking (Minggu 7–10)
- [ ] **Smart RFQ** v1 (unggah spec → form terstruktur).
- [ ] **Capacity Matrix** + matchmaking berbasis aturan (rule-based dulu, AI menyusul).
- [ ] **Dynamic Bidding Dashboard** + Gantt timeline.
- [ ] Integrasi **Milestone Verification** (unggah foto geo-tagged — web dulu, mobile menyusul).

## Fase 4 — Escrow Produksi & Polish (Minggu 11–12)
- [ ] Pindah escrow dari sandbox → production (dengan idempotency & webhook).
- [ ] UI/UX **high-fidelity prototype** halaman RFQ futuristik untuk acara peluncuran.
- [ ] Audit keamanan + audit trail finansial.
- [ ] Materi demo & skrip presentasi *From Project Opportunity to Verified Execution*.

## Deliverable Peluncuran
- Platform demo stabil (web) + prototype RFQ futuristik.
- Dokumen kemitraan & onboarding shipyard/SIUPAL siap pakai.
- Sandbox→produksi escrow tervalidasi.

## Risiko & Mitigasi
| Risiko | Mitigasi |
|---|---|
| Keterlambatan integrasi escrow | Mulai sandbox sejak minggu 3; siapkan fallback virtual account |
| Ketergantungan vendor AI | Rule-based matchmaking dulu, AI inkremental |
| Regulasi data maritim | Data residency Indonesia sejak awal |
