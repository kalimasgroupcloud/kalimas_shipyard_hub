// KSH — Partner Onboarding & Verification data layer.
// Defines the shipyard onboarding journey: legal identity → document upload →
// capacity matrix → review, then the verification pipeline & tier criteria.
// Grounded in the same compliance.js regulatory basis (SIUP, BKI class, ISO).

// ---- Partner tier criteria (drives auto-tier suggestion) --------------------
export const tierCriteria = [
  { tier: 'Gold', minScore: 88, dock: 150, perks: ['Featured on homepage', 'Priority RFQ matching', 'Dedicated Kalimas operator', 'Escrow fee −1.0%'] },
  { tier: 'Silver', minScore: 74, dock: 100, perks: ['Directory badge', 'Standard RFQ matching', 'Shared operator pool', 'Escrow fee −0.5%'] },
  { tier: 'Bronze', minScore: 60, dock: 60, perks: ['Directory listing', 'RFQ notifications', 'Community support'] },
]

// ---- Verification pipeline stages (the trust workflow) ---------------------
export const verificationStages = [
  { id: 'legal', label: 'Legal identity', desc: 'NIB, NPWP & SIUP validated against OSS-RBA.', icon: '📄' },
  { id: 'siupal', label: 'SIUPAL / trade licence', desc: 'Shipping-business permit scope checked.', icon: '⚖️' },
  { id: 'bki', label: 'BKI class certificate', desc: 'Classification membership & survey validity confirmed with BKI.', icon: '🎖️' },
  { id: 'capacity', label: 'Capacity audit', desc: 'Dock LOA/breadth, crane & graving-dock figures verified on site.', icon: '📐' },
  { id: 'active', label: 'Partner active', desc: 'Goes live on the directory and starts receiving matched RFQs.', icon: '🚀' },
]

// ---- Document checklist a shipyard must upload ------------------------------
export const requiredDocs = [
  { id: 'nib', label: 'NIB (OSS-RBA)', detail: 'Business Identification Number', mandatory: true },
  { id: 'npwp', label: 'NPWP', detail: 'Company tax number', mandatory: true },
  { id: 'siup', label: 'SIUP (industrial)', detail: 'Trading/industrial licence', mandatory: true },
  { id: 'bki', label: 'BKI Class Certificate', detail: 'Valid classification membership', mandatory: true },
  { id: 'iso', label: 'ISO 9001 / 45001', detail: 'Quality & safety management (optional but boosts tier)', mandatory: false },
  { id: 'surveys', label: 'Recent survey reports', detail: 'Annual / special survey within 12 months', mandatory: false },
]

// ---- Capacity matrix template (mirrors catalog.js shipyard shape) -----------
export const capacityTemplate = {
  dockLength: 0, dockBreadth: 0, gravingDocks: 0,
  crane: '', maxDraft: 0,
}

// ---- Auto-tier suggestion from capacity + docs ------------------------------
export function suggestTier({ dockLength = 0, gravingDocks = 0, hasIso = false, hasBki = true }) {
  let score = 0
  score += Math.min(40, dockLength / 5)          // dock length up to 40
  score += Math.min(25, gravingDocks * 8)         // graving docks up to 25
  score += hasBki ? 20 : 0                        // BKI class
  score += hasIso ? 15 : 0                        // ISO bonus
  score = Math.round(score)
  const tier = score >= 74 ? (score >= 88 ? 'Gold' : 'Silver') : 'Bronze'
  return { score, tier }
}
