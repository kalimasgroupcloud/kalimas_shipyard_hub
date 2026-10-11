# KSH — Registrasi & Verifikasi (SIUPAL & Shipyard)

## A. Jalur Ship Owner / Pemegang SIUPAL
**Dokumen wajib:**
- SIUPAL (Surat Izin Usaha Perusahaan Angkutan Laut)
- NIB, NPWP, Akta Perusahaan
- Data PIC & wewenang penandatangan
- (Per proyek) Grosse Akte / Pas Besar / Sertifikat Kapal

**Alur:**
1. Daftar akun → verifikasi email/WhatsApp (OTP).
2. Unggah dokumen (OCR + checklist otomatis).
3. Verifikasi silang nomor SIUPAL.
4. Keputusan: **Disetujui / Perlu perbaikan / Ditolak**.
5. Status **Verified** → berhak membuat RFQ.

## B. Jalur Shipyard (Mitra Galangan)
**Dokumen wajib:**
- NIB / SIUP perusahaan galangan
- **Sertifikasi Kelas (BKI / class society)** — wajib
- Spesifikasi fasilitas: dock/slipway (dimensi), kapasitas crane (ton), luas area
- Dokumen HSE & QA
- Kapasitas slot & lokasi (untuk Capacity Matrix)

**Alur:**
1. Daftar sebagai mitra.
2. Unggah sertifikasi + data fasilitas (Capacity Matrix).
3. Verifikasi dokumen + audit (fisik/remote).
4. Scoring kapabilitas → Tier **Bronze / Silver / Gold**.
5. Aktif menerima RFQ yang cocok dengan kapasitasnya.

## C. Status & SLA
- Verifikasi dokumen: **SLA 2×24 jam kerja**.
- Data fasilitas & slot wajib diperbarui **per kuartal** (near real-time saat milestone berjalan).
- Penolakan menyertakan alasan jelas + jalur banding.

## D. Kontrol Kualitas
- Satu sumber kebenaran sertifikasi (integrasi class society bila tersedia).
- Peringatan otomatis saat sertifikasi mendekati kadaluarsa.
- Capacity Matrix divalidasi berkala agar matchmaking akurat.
