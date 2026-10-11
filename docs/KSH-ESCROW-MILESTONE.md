# KSH — Escrow Multi-Termin Berbasis Milestone Fisik

## Konsep
Dana ship owner **dikunci di Escrow pihak ketiga** saat kontrak ditandatangani.
Dana **cair per termin** mengikuti **progres fisik terverifikasi**, bukan jadwal waktu semata.

## Alur
1. Kontrak terbentuk dari RFQ + penawaran terpilih.
2. Ship owner mendanai Escrow (100% / per paket termin).
3. Setiap milestone didefinisikan di kontrak. Contoh (repair):
   `Mobilisasi → Docking → Blasting → Penggantian Plat → Coating → Testing → Handover`.
4. Shipyard mengunggah **bukti progres** (foto/video **geo-tagged**) via Mobile Field App.
5. Verifikasi: **Inspector Kalimas + approval Ship Owner** (dual control).
6. Sistem memicu **pelepasan termin** ke rekening shipyard pelaksana.
7. Sisa dana + **retensi (garansi)** dilepas setelah handover & masa garansi berakhir.

## Verifikasi Bukti (Anti-Fraud)
- Geo-tagging + timestamp **server-side** (tidak bisa dipalsukan di klien).
- Foto/video dari sudut & checklist standar per milestone.
- Cross-check **AI** (perubahan visual) sebagai flag awal.
- **Dual approval**: tanpa persetujuan ganda, dana tidak cair.

## Penanganan Sengketa (Dispute)
- Jika ship owner menolak milestone → eskalasi ke **Panel Mediasi Kalimas**.
- Dana termunda tetap aman di escrow hingga putusan final.

## Model Pendapatan Kalimas
- **Operator fee / komisi** dari nilai kontrak yang dicairkan (recurring).
- (Opsional) biaya layanan verifikasi independen & escrow.

## Integrasi Teknis
- **Escrow Sandbox** dulu (uji transaksi dummy) → Production.
- Webhook status pembayaran ↔ KSH Payments Service.
- **Idempotency key** pada setiap mutasi dana (cegah double-payment).
