// KSH — Compliance & Verification data layer + real validators.
// Grounded in Indonesian law (UU No. 17/2008 on Pelayaran) and international
// instruments (IMO Res A.600(15) / A.1117(30), SOLAS, MARPOL, IACS, ISM/ISPS, MLC 2006).
// These are demo-grade references; a production build calls SISWALAKSANA / GISIS / BKI.

// ---- Regulatory / legal references ----------------------------------------
export const regulations = [
  { id: 'uu172008', code: 'UU No. 17 Tahun 2008', title: 'Shipping Law (Undang-Undang Pelayaran)', body: 'Government of Indonesia', scope: 'Indonesia', note: 'Primary legal basis for SIUPAL shipping-business licensing and cabotage rules.' },
  { id: 'imoa600', code: 'IMO Res. A.600(15)', title: 'IMO Ship Identification Number Scheme', body: 'International Maritime Organization (1987)', scope: 'International', note: 'Created the permanent 7-digit IMO ship number (Lloyd\u2019s Register series).' },
  { id: 'imoa1117', code: 'IMO Res. A.1117(30)', title: 'IMO Ship Identification Number Scheme (rev.)', body: 'International Maritime Organization (2017)', scope: 'International', note: 'Latest revision; codifies the check-digit construction & 2002 security enhancements.' },
  { id: 'solas13', code: 'SOLAS Ch. I Reg. 3', title: 'Mandatory IMO Number & Certificates', body: 'International Maritime Organization', scope: 'International', note: 'IMO number mandatory for passenger & cargo ships above threshold since 1996.' },
  { id: 'marpol', code: 'MARPOL 73/78', title: 'Marine Pollution Prevention (Annexes I, IV, VI)', body: 'International Maritime Organization', scope: 'International', note: 'Basis for IOPP, ISPP, IAPP & Energy-Efficiency certificates.' },
  { id: 'ism', code: 'ISM / ISPS Code', title: 'Safety Management & Ship Security', body: 'International Maritime Organization', scope: 'International', note: 'DOC/SMC (ISM) and ISSC (ISPS) mandatory for covered ships.' },
  { id: 'mlc', code: 'MLC, 2006', title: 'Maritime Labour Convention', body: 'International Labour Organization', scope: 'International', note: 'Maritime Labour Certificate; conditions of employment on board.' },
  { id: 'iacs', code: 'IACS', title: 'International Association of Classification Societies', body: 'IACS (13 members)', scope: 'International', note: 'BKI is a member; surveys follow unified IACS classification rules.' },
]

// ---- SIUPAL license types (UU No. 17/2008 & implementing regs) ------------
export const siupalTypes = [
  { code: 'SIUPAL-PKP', label: 'Passenger Shipping', sub: 'Kapal Penumpang', desc: 'Domestic passenger vessels (ferry, speed-boat, tourist).' },
  { code: 'SIUPAL-PKB', label: 'Cargo Shipping', sub: 'Kapal Barang', desc: 'Domestic general/bulk cargo shipping (cabotage).' },
  { code: 'SIUPAL-PKTK', label: 'Tug & Dredge', sub: 'Kapal Tunda & Gerus', desc: 'Tugboats, towage and dredging operations.' },
  { code: 'SIUPAL-PKLK', label: 'Special-Purpose Sea', sub: 'Kapal Laut Khusus', desc: 'Offshore support: AHTS, PSV, seismic, drilling-support.' },
  { code: 'SIUPAL-PKR', label: 'Raft Shipping', sub: 'Kapal Rakit', desc: 'Timber & unpowered raft towing.' },
]

// ---- BKI classification survey cycle --------------------------------------
export const bkiSurveys = [
  { name: 'Initial Survey', cycle: 'On entry into class', scope: 'Plan approval, keel/launch attendance, sea trials', target: 'New-build / first classification' },
  { name: 'Annual Survey', cycle: 'Every 12 months', scope: 'Hull, machinery, electrical, fire & life-saving appliances', target: 'Continuous class validity' },
  { name: 'Intermediate Survey', cycle: 'Between 2nd & 3rd annual', scope: 'Selected special-survey items (anchor, hull openings)', target: 'Continuous survey scheme' },
  { name: 'Special / Renewal Survey', cycle: 'Every 5 years', scope: 'In dry-dock, extensive plating gauging, internal exam', target: 'Renewal of class certificate' },
  { name: 'Bottom / Dry-Docking Survey', cycle: 'Twice in 5 yrs (\u226436 mo apart)', scope: 'Hull below waterline; UWILD may substitute one', target: 'Bottom integrity' },
  { name: 'Tailshaft Survey', cycle: 'Every 5 years', scope: 'Propeller shaft withdrawal / crack detection', target: 'Propulsion integrity' },
  { name: 'Boiler Survey', cycle: 'Every 2.5 years', scope: 'Internal exam & hydrostatic test of boilers', target: 'Steam plant integrity' },
]

// ---- Statutory certificates BKI issues as Recognized Organization ----------
export const statutoryCerts = [
  { name: 'Cargo Ship Safety Construction Cert.', ref: 'SOLAS II-1' },
  { name: 'Cargo Ship Safety Equipment Cert.', ref: 'SOLAS III' },
  { name: 'Cargo Ship Safety Radio Cert.', ref: 'SOLAS IV' },
  { name: 'International Load Line Cert.', ref: 'ILLC 1966' },
  { name: 'IOPP Certificate', ref: 'MARPOL Annex I' },
  { name: 'ISPP Certificate', ref: 'MARPOL Annex IV' },
  { name: 'IAPP Certificate', ref: 'MARPOL Annex VI' },
  { name: 'International Energy Efficiency Cert.', ref: 'MARPOL Annex VI' },
  { name: 'Int. Tonnage Certificate', ref: 'ITC 1969' },
  { name: 'Document of Compliance (DOC)', ref: 'ISM Code' },
  { name: 'Safety Management Certificate (SMC)', ref: 'ISM Code' },
  { name: 'International Ship Security Cert.', ref: 'ISPS Code' },
  { name: 'Maritime Labour Certificate', ref: 'MLC 2006' },
  { name: 'Anti-Fouling Systems Cert.', ref: 'AFS 2001' },
]

// ---- IMO check-digit validator (real algorithm) ---------------------------
// Weights 7,6,5,4,3,2 on the first six digits; check digit = sum mod 10.
// Verified: IMO 8814275 -> 56+48+5+16+6+14 = 145 -> 145 % 10 = 5 (valid).
export function imoCheckDigit(firstSix) {
  const s = String(firstSix).replace(/[^0-9]/g, '').slice(0, 6)
  if (s.length !== 6) return null
  const sum = s.split('').reduce((acc, ch, i) => acc + Number(ch) * (7 - i), 0)
  return sum % 10
}

export function validateImo(input) {
  const compact = String(input).toUpperCase().replace(/^IMO/, '').replace(/[^0-9]/g, '')
  if (compact.length !== 7) {
    return { ok: false, compact, reason: 'length', message: 'An IMO number is exactly 7 digits (optionally prefixed "IMO").' }
  }
  const first6 = compact.slice(0, 6)
  const provided = Number(compact[6])
  const calc = imoCheckDigit(first6)
  const breakdown = first6.split('').map((ch, i) => ({ digit: Number(ch), weight: 7 - i, product: Number(ch) * (7 - i) }))
  const total = breakdown.reduce((a, b) => a + b.product, 0)
  return {
    ok: calc === provided,
    compact,
    reason: calc === provided ? 'valid' : 'checksum',
    message: calc === provided ? 'Check digit valid — this IMO number is internally consistent.' : `Check digit mismatch: expected ${calc}, got ${provided}.`,
    first6, providedCheck: provided, calcCheck: calc, breakdown, total,
  }
}
