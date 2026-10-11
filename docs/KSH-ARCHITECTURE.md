# Kalimas Shipyard Hub (KSH) — Enterprise Architecture

> Status: Draft v1.0 · Owner: IT Product & Platform Lead
> Basis strategis: Balikpapan (Gerbang IKN) · Situs utama: www.kalimasgroup.com

## 1. Prinsip Desain
- **Digital-first, asset-light**: keterbatasan lahan fisik dikonversi menjadi jaringan kapasitas ratusan galangan mitra (infinite network).
- **Kalimas = Main Project Operator & Customer Aggregator**, bukan pemilik fisik semata. Kami mengorkestrasi, mitra mengeksekusi.
- **Trust by design**: verifikasi ketat (SIUPAL/sertifikasi galangan) + escrow multi-termin = keamanan finansial.
- **Multi-tenant scalable**: 1 shipyard = 1 tenant; ribuan ship owner di atasnya.
- **Evolusi, bukan ganti**: demo `app/` (React 19 + Vite 8, localStorage) menjadi fondasi UI.

## 2. Arsitektur Tingkat Tinggi (Lapisan)
```
[Presentation]   Web App (React+Vite)  ·  Mobile Field App (Android/iOS) — verifikasi progres
        |  HTTPS / TLS 1.3
[API / BFF]      API Gateway (auth, rate-limit, WAF) — REST + GraphQL, RBAC, audit log
        |
[Core Services — Microservices]
   · Identity & Access      — SSO ke kalimasgroup.com, KYB/KYC
   · Vessel & Spec Service  — LOA, Breadth, Draft, GT, repair list
   · RFQ Engine             — ingestion CAD/blueprint, ekstraksi AI
   · Matchmaking & Capacity — capacity matrix & slot real-time
   · Bidding & Contract     — lelang dinamis, kontrak digital
   · Escrow Integration     — jembatan ke mitra escrow
   · Milestone Verification — bukti geo-tagged progres fisik
   · Notification           — email/WA/push
   · Payments & Invoicing   — termin, fee operator
        |
[Data Layer]
   · PostgreSQL   — relational core (users, projects, contracts, milestones)
   · Redis        — cache, session, queue
   · Object Store — S3-compatible (CAD, blueprint, foto/video progres)
   · OpenSearch   — pencarian & matchmaking kapabilitas
        |
[Integrations]
   · www.kalimasgroup.com (secure API / SSO)
   · Escrow & Payment partner (sandbox → production)
   · Class Society (BKI) — validasi sertifikasi (future)
   · Dukcapil / e-FIN — KYB otomatis (future)
```

## 3. Target Skalabilitas (Tahun 1)
- 100+ shipyard tenant, 1.000+ ship owner aktif.
- Layanan *stateless* + horizontal scaling di belakang load balancer.
- Object storage tanpa batas untuk dokumen CAD berukuran besar.
- Read-replica DB untuk dashboard analitik (tanpa mengganggu transaksi).

## 4. Keamanan & Kepatuhan
- TLS 1.3, enkripsi at-rest AES-256 untuk dokumen & bukti.
- RBAC + least privilege; **audit trail** untuk setiap aksi finansial.
- Pemisahan environment: dev / staging / prod; escrow diuji di **sandbox** dulu.
- Data residency di server Indonesia (kepatuhan regulasi maritim & data).

## 5. Evolusi dari Demo Saat Ini
Demo `app/src/App.jsx` (single-component, localStorage) dipecah menjadi modul per domain:
`RFQ` · `Matching` · `Bidding` · `Escrow` · `Dashboard`.
State `localStorage` diganti panggilan API BFF; tambah **Mobile Field App** untuk verifikasi milestone geo-tagged.

## 6. Deployment (Usulan)
- Web statis → CDN.
- Service API → container (Docker/K8s) di cloud Indonesia.
- CI/CD otomatis dari repo: build Vite → deploy; lint via oxlint.
