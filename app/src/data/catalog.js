// KSH Platform — central mock data layer (demo-grade, deterministic).
// Serves as the seed that a future API/BFF will replace 1:1.

export const categories = [
  { id: 'repair', label: 'Ship Repair & Docking', icon: '🛠️', count: 128 },
  { id: 'newbuild', label: 'New Build / Construction', icon: '🚢', count: 47 },
  { id: 'conversion', label: 'Vessel Conversion', icon: '⚙️', count: 63 },
  { id: 'steel', label: 'Steel & Fabrication', icon: '🏗️', count: 91 },
  { id: 'engine', label: 'Engine & Mechanical', icon: '🔧', count: 74 },
  { id: 'survey', label: 'Inspection & Special Survey', icon: '🔍', count: 52 },
]

export const shipyards = [
  {
    id: 'SY-001', name: 'Galangan Nusantara Balikpapan', location: 'Balikpapan, Kaltim',
    tier: 'Gold', score: 94, verified: true,
    dockLength: 180, dockBreadth: 32, crane: '2 × 150 ton', gravingDocks: 3,
    certifications: ['BKI', 'ISO 9001', 'ISO 45001'],
    specialties: ['repair', 'newbuild', 'steel'],
    capacity: { used: 62, total: 100 }, rating: 4.9, reviews: 214, projectsDone: 168,
    responseTime: '< 4 hours', established: 1998,
    blurb: 'Full-service yard with 3 graving docks, on-site class survey and heavy-lift capability for offshore support vessels.'
  },
  {
    id: 'SY-002', name: 'KSO Yard Makassar', location: 'Makassar, Sulsel',
    tier: 'Gold', score: 91, verified: true,
    dockLength: 165, dockBreadth: 30, crane: '1 × 200 ton', gravingDocks: 2,
    certifications: ['BKI', 'ISO 9001'],
    specialties: ['repair', 'conversion', 'engine'],
    capacity: { used: 48, total: 80 }, rating: 4.8, reviews: 156, projectsDone: 132,
    responseTime: '< 6 hours', established: 2004,
    blurb: 'Eastern Indonesia hub specialising in tugboat overhaul and landing craft conversion with in-house machining.'
  },
  {
    id: 'SY-003', name: 'Batam Marine Industries', location: 'Batam, Kepri',
    tier: 'Gold', score: 93, verified: true,
    dockLength: 210, dockBreadth: 38, crane: '2 × 250 ton', gravingDocks: 4,
    certifications: ['BKI', 'ISO 9001', 'ISO 14001', 'ISO 45001'],
    specialties: ['newbuild', 'repair', 'steel'],
    capacity: { used: 81, total: 120 }, rating: 4.9, reviews: 301, projectsDone: 245,
    responseTime: '< 3 hours', established: 1991,
    blurb: 'Largest new-build capacity in the network; delivers AHTS and PSV for offshore operators with integrated outfitting.'
  },
  {
    id: 'SY-004', name: 'Surabaya Dock & Engineering', location: 'Surabaya, Jatim',
    tier: 'Silver', score: 86, verified: true,
    dockLength: 140, dockBreadth: 26, crane: '1 × 100 ton', gravingDocks: 2,
    certifications: ['BKI', 'ISO 9001'],
    specialties: ['repair', 'engine', 'survey'],
    capacity: { used: 35, total: 60 }, rating: 4.7, reviews: 98, projectsDone: 87,
    responseTime: '< 8 hours', established: 2007,
    blurb: 'Trusted for engine reconditioning and special surveys with rapid turnaround on cargo vessels up to 5,000 DWT.'
  },
  {
    id: 'SY-005', name: 'Pontianak Coastal Works', location: 'Pontianak, Kalbar',
    tier: 'Silver', score: 82, verified: true,
    dockLength: 120, dockBreadth: 24, crane: '1 × 80 ton', gravingDocks: 1,
    certifications: ['BKI'],
    specialties: ['repair', 'steel'],
    capacity: { used: 22, total: 40 }, rating: 4.6, reviews: 64, projectsDone: 71,
    responseTime: '< 12 hours', established: 2012,
    blurb: 'Barge and tug specialist serving Kalimantan river & coastal operators with competitive steel repair rates.'
  },
  {
    id: 'SY-006', name: 'Bitung Northern Yard', location: 'Bitung, Sulut',
    tier: 'Bronze', score: 76, verified: true,
    dockLength: 95, dockBreadth: 20, crane: '1 × 50 ton', gravingDocks: 1,
    certifications: ['BKI'],
    specialties: ['repair', 'survey'],
    capacity: { used: 14, total: 30 }, rating: 4.5, reviews: 41, projectsDone: 48,
    responseTime: '< 24 hours', established: 2016,
    blurb: 'Emerging yard focused on fishing fleet and small craft maintenance across North Sulawesi.'
  },
]

// ---- Compliance & class standing per shipyard ---------------------------
// BKI approves the YARD (workshop/company approval + hosted class surveys).
// IMO Numbers identify the VESSELS a yard has serviced (valid check digits,
// re-validated live in the UI via validateImo()). SIUPAL is a ship-owner
// licence verified by Kalimas on the buyer side before escrow (UU 17/2008).
export const yardCompliance = {
  'SY-001': {
    bkiApproval: 'BKI-CA-1998-0142', lastAudit: '2026-03-18',
    workshopApproval: 'BKI Workshop — Welding (Grade III)',
    approvedSurveys: ['Annual', 'Special (5-yr)', 'Dry-docking', 'Tailshaft', 'Boiler'],
    fleet: [
      { name: 'KM Nusantara Jaya', type: 'Tug 2,400 HP', imo: '8814275' },
      { name: 'TB Samudra 7', type: 'Tug 1,800 HP', imo: '9418274' },
      { name: 'KM Kalmas Indah', type: 'PSV 4,000 DWT', imo: '9074729' },
    ]
  },
  'SY-002': {
    bkiApproval: 'BKI-CA-2004-0388', lastAudit: '2026-02-09',
    workshopApproval: 'BKI Workshop — Welding (Grade II)',
    approvedSurveys: ['Annual', 'Intermediate', 'Dry-docking', 'Tailshaft'],
    fleet: [
      { name: 'TB Makassar Jaya', type: 'Tug 3,000 HP', imo: '9456238' },
      { name: 'LCT Kalmas 300', type: 'Landing Craft 300 ft', imo: '9345673' },
    ]
  },
  'SY-003': {
    bkiApproval: 'BKI-CA-1991-0011', lastAudit: '2026-04-02',
    workshopApproval: 'BKI Workshop — Welding (Grade III)',
    approvedSurveys: ['Initial', 'Annual', 'Special (5-yr)', 'Dry-docking', 'Boiler', 'Tailshaft'],
    fleet: [
      { name: 'AHTS Kalmas 101', type: 'AHTS 4,000 HP', imo: '9123453' },
      { name: 'PSV Samudra Biru', type: 'PSV 6,000 DWT', imo: '9612349' },
    ]
  },
  'SY-004': {
    bkiApproval: 'BKI-CA-2007-0521', lastAudit: '2026-01-27',
    workshopApproval: 'BKI Workshop — Welding (Grade II)',
    approvedSurveys: ['Annual', 'Special (5-yr)', 'Dry-docking'],
    fleet: [
      { name: 'MV Cargo Nusa', type: 'Cargo 5,000 DWT', imo: '9234563' },
      { name: 'KM Pelita Laut', type: 'Cargo 3,200 DWT', imo: '9456783' },
    ]
  },
  'SY-005': {
    bkiApproval: 'BKI-CA-2012-0663', lastAudit: '2025-12-11',
    workshopApproval: 'BKI Workshop — Welding (Grade I)',
    approvedSurveys: ['Annual', 'Dry-docking'],
    fleet: [
      { name: 'TB Pontianak 5', type: 'Tug 1,200 HP', imo: '9567893' },
      { name: 'Split Hopper Barge Kalmas 21', type: 'Barge 900 DWT', imo: '9678903' },
    ]
  },
  'SY-006': {
    bkiApproval: 'BKI-CA-2016-0745', lastAudit: '2025-11-30',
    workshopApproval: 'BKI Workshop — Welding (Grade I)',
    approvedSurveys: ['Annual'],
    fleet: [
      { name: 'KM Bitung Murni', type: 'Cargo / Fishing 1,200 DWT', imo: '9789013' },
      { name: 'TB Bitung Jaya', type: 'Tug 800 HP', imo: '9890123' },
    ]
  },
}



export const rfqs = [
  {
    id: 'RFQ-2041', title: 'Tugboat 2,400 HP — Dry-dock & Hull Blast',
    owner: 'PT Pelayaran Nusantara Jaya', siupal: 'SIUPAL-2019-0421', verified: true,
    vessel: 'Tugboat 2,400 HP', loa: 38, type: 'repair', budget: 'Rp 4.5 – 6 M',
    location: 'Balikpapan / Makassar', deadline: '2026-11-05', bids: 7,
    postedAgo: '2 days ago',
    summary: 'Annual docking, hull blasting & coating, propeller polishing, and sea trial. Requires class survey attendance.',
    tags: ['Dry-dock', 'Hull coating', 'Class survey'],
    bidList: [
      { yard: 'Galangan Laut Bahari', tier: 'Gold', price: 4620000, duration: 22, warranty: '12 months', rating: 4.8, when: '6 hours ago', ai: true },
      { yard: 'KSO Yard Makassar', tier: 'Gold', price: 5180000, duration: 19, warranty: '12 months', rating: 4.7, when: '1 day ago' },
      { yard: 'Bahari Dockyard Surabaya', tier: 'Silver', price: 5540000, duration: 24, warranty: '6 months', rating: 4.5, when: '1 day ago' },
      { yard: 'Nusantara Shiprepair', tier: 'Silver', price: 5890000, duration: 20, warranty: '6 months', rating: 4.3, when: '2 days ago' },
      { yard: 'Timur Jaya Galangan', tier: 'Bronze', price: 6250000, duration: 27, warranty: '3 months', rating: 4.1, when: '2 days ago' },
    ]
  },
  {
    id: 'RFQ-2040', title: 'Cargo 5,000 DWT — Special Survey & Steel Renewal',
    owner: 'CV Samudera Lines', siupal: 'SIUPAL-2021-1188', verified: true,
    vessel: 'Cargo 5,000 DWT', loa: 102, type: 'survey', budget: 'Rp 8 – 11 M',
    location: 'Batam / Surabaya', deadline: '2026-11-12', bids: 12,
    postedAgo: '3 days ago',
    summary: 'Fifth special survey including shell plate renewal (est. 12 tons), tank testing and full class documentation.',
    tags: ['Special survey', 'Steel renewal', 'Class survey'],
    bidList: [
      { yard: 'Bahari Dockyard Surabaya', tier: 'Silver', price: 9250000, duration: 34, warranty: '12 months', rating: 4.6, when: '2 days ago', ai: true },
      { yard: 'Batam Marine Works', tier: 'Gold', price: 9900000, duration: 30, warranty: '12 months', rating: 4.8, when: '2 days ago' },
      { yard: 'Galangan Laut Bahari', tier: 'Gold', price: 10450000, duration: 28, warranty: '6 months', rating: 4.8, when: '1 day ago' },
      { yard: 'Nusantara Shiprepair', tier: 'Silver', price: 10900000, duration: 32, warranty: '6 months', rating: 4.3, when: '1 day ago' },
      { yard: 'KSO Yard Makassar', tier: 'Gold', price: 11500000, duration: 26, warranty: '12 months', rating: 4.7, when: '8 hours ago' },
    ]
  },
  {
    id: 'RFQ-2039', title: 'LCT 300 ft — Conversion to Offshore Support',
    owner: 'PT Maritim Kaltim Prima', siupal: 'SIUPAL-2017-0093', verified: true,
    vessel: 'Landing Craft Tank 300 ft', loa: 91, type: 'conversion', budget: 'Rp 18 – 24 M',
    location: 'Batam', deadline: '2026-11-20', bids: 4,
    postedAgo: '5 days ago',
    summary: 'Convert LCT to AHTS configuration: new accommodation block, towing notch, dynamic positioning retrofit.',
    tags: ['Conversion', 'AHTS', 'Outfitting'],
    bidList: [
      { yard: 'Batam Marine Works', tier: 'Gold', price: 19500000, duration: 145, warranty: '24 months', rating: 4.8, when: '3 days ago', ai: true },
      { yard: 'Bahari Dockyard Surabaya', tier: 'Silver', price: 21000000, duration: 158, warranty: '12 months', rating: 4.6, when: '2 days ago' },
      { yard: 'KSO Yard Makassar', tier: 'Gold', price: 22400000, duration: 138, warranty: '18 months', rating: 4.7, when: '1 day ago' },
    ]
  },
  {
    id: 'RFQ-2038', title: 'PSV New-build — 4,000 DWT Platform Supply Vessel',
    owner: 'PT Energi Laut Biru', siupal: 'SIUPAL-2020-0772', verified: true,
    vessel: 'PSV 4,000 DWT', loa: 82, type: 'newbuild', budget: 'Rp 90 – 120 M',
    location: 'Batam (preferred)', deadline: '2026-12-01', bids: 9,
    postedAgo: '1 week ago',
    summary: 'New-build PSV with DP2, FiFi-1, 1,000 m² deck area. Delivery target 14 months from contract.',
    tags: ['New-build', 'PSV', 'DP2'],
    bidList: [
      { yard: 'Batam Marine Works', tier: 'Gold', price: 98000000, duration: 400, warranty: '24 months', rating: 4.8, when: '4 days ago', ai: true },
      { yard: 'Nusantara Shiprepair', tier: 'Silver', price: 104000000, duration: 430, warranty: '18 months', rating: 4.3, when: '3 days ago' },
      { yard: 'Galangan Laut Bahari', tier: 'Gold', price: 112000000, duration: 395, warranty: '24 months', rating: 4.8, when: '2 days ago' },
      { yard: 'Bahari Dockyard Surabaya', tier: 'Silver', price: 118000000, duration: 415, warranty: '12 months', rating: 4.6, when: '1 day ago' },
    ]
  },
]

export const escrowMilestones = [
  { id: 'M1', name: 'Contract & Mobilisation', weight: 15, status: 'released', date: '2026-09-01', amount: 'Rp 0.9 M' },
  { id: 'M2', name: 'Docking & Blasting', weight: 25, status: 'released', date: '2026-09-18', amount: 'Rp 1.5 M' },
  { id: 'M3', name: 'Steel Renewal & Welding', weight: 30, status: 'verifying', date: '—', amount: 'Rp 1.8 M' },
  { id: 'M4', name: 'Coating & Machinery', weight: 20, status: 'locked', date: '—', amount: 'Rp 1.2 M' },
  { id: 'M5', name: 'Sea Trial & Handover', weight: 10, status: 'locked', date: '—', amount: 'Rp 0.6 M' },
]

export const trustStats = [
  { value: '320+', label: 'Shipyard network', icon: '⚓' },
  { value: '1,850', label: 'SIUPAL owners onboard', icon: '📜' },
  { value: 'Rp 420 M', label: 'Value secured via escrow', icon: '🔒' },
  { value: '98.6%', label: 'On-time milestone rate', icon: '✅' },
]

export const howItWorks = {
  shipowner: [
    { n: 1, title: 'Post your RFQ', text: 'Upload specs, blueprints or CAD. Our AI maps scope instantly.' },
    { n: 2, title: 'Receive matched bids', text: 'Qualified shipyards bid on price, duration and warranty.' },
    { n: 3, title: 'Award & fund escrow', text: 'Winner is locked, funds secured in escrow by milestones.' },
    { n: 4, title: 'Track verified progress', text: 'Geo-tagged evidence releases each payment term.' },
  ],
  shipyard: [
    { n: 1, title: 'Register & get verified', text: 'Submit BKI/class certification and facility capacity matrix.' },
    { n: 2, title: 'Get matched to demand', text: 'AI routes RFQs that fit your docks, cranes and slots.' },
    { n: 3, title: 'Bid competitively', text: 'Transparent bidding dashboard with live cost projection.' },
    { n: 4, title: 'Get paid per milestone', text: 'Escrow pays out on verified physical progress.' },
  ],
}

export const testimonials = [
  { quote: 'Kalimas Shipyard Hub found us a yard with a free slot when our own dock was full. Project delivered two weeks early.', author: 'Budi Santoso', role: 'Fleet Manager, PT Pelayaran Nusantara' },
  { quote: 'The escrow milestone system removed all payment anxiety. We focus on the work, the platform handles trust.', author: 'Ir. Hendra Wijaya', role: 'Director, KSO Yard Makassar' },
  { quote: 'As a small operator, we finally get fair access to the same yards the big owners use.', author: 'Siti Rahma', role: 'Owner, CV Samudera Lines' },
]

export const platformMetrics = {
  activeProjects: 24,
  openRfqs: rfqs.length,
  yardsOnline: shipyards.length,
  totalBids: rfqs.reduce((sum, r) => sum + r.bids, 0),
}
