import { useState } from 'react'
import './App.css'

const projects = [
  { id: 'KMH-026', name: 'Tugboat — Maintenance & Repair', client: 'Demo Client A', vessel: 'Tugboat 2,400 HP', status: 'Matching Yard', progress: 68, budget: 'Rp 4,8 M', yard: 'KSO Yard A' },
  { id: 'KMH-025', name: 'Landing Craft Tank — Conversion', client: 'Demo Client B', vessel: 'LCT 300 ft', status: 'Engineering', progress: 42, budget: 'Rp 12,5 M', yard: 'Assessment' },
  { id: 'KMH-024', name: 'Cargo Vessel — Special Survey', client: 'Demo Client C', vessel: 'Cargo 5,000 DWT', status: 'Procurement', progress: 81, budget: 'Rp 2,1 M', yard: 'KSO Yard B' },
]

const nav = [
  { label: 'Overview', items: ['Dashboard'] },
  { label: 'PROJECT DELIVERY', items: ['Projects', 'Vessel & Scope', 'KSO Matching', 'KSO Evidence'] },
]

function App() {
  const [active, setActive] = useState('Dashboard')
  const [selected, setSelected] = useState(projects[0])
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)

  const filtered = projects.filter(p =>
    `${p.id} ${p.name} ${p.client} ${p.vessel}`.toLowerCase().includes(search.toLowerCase())
  )

  const pageTitle = {
    Dashboard: 'Maritime operations overview',
    Projects: 'Project portfolio',
    'Vessel & Scope': 'Vessel & scope definition',
    'KSO Matching': 'Shipyard capability matching',
    'KSO Evidence': 'Yard evidence & verification',
  }[active] || active

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/kalimas-logo-transparent.png" alt="Kalimas" />
          <div className="brand-caption">MARITIME HUB <span>EDGE NETWORK</span></div>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        {nav.map(group => (
          <div className="nav-group" key={group.label}>
            {group.label !== 'Overview' && <div className="nav-heading">{group.label}</div>}
            {group.items.map(item => (
              <button key={item} className={`nav-item ${active === item ? 'active' : ''}`} onClick={() => setActive(item)}>
                <span className="nav-mark">{item === 'Dashboard' ? '◫' : item === 'Projects' ? '▤' : item === 'Vessel & Scope' ? '◈' : item === 'KSO Matching' ? '⌘' : '◎'}</span>
                {item}
                {item === 'Projects' && <span className="nav-count">03</span>}
              </button>
            ))}
          </div>
        ))}
        <div className="sidebar-bottom">
          <div className="connection"><span className="status-dot" /> Demo environment</div>
          <div className="user-profile"><div className="avatar">KG</div><div><strong>Kalimas Group</strong><small>Project orchestrator</small></div><span className="more">···</span></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">KALIMAS <span>/</span> MARITIME HUB <span>/</span> <b>{active.toUpperCase()}</b></div>
          <div className="top-actions"><span className="demo-pill"><i /> DEMO DATA</span><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="top-avatar">KG</div></div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow"><span /> MARITIME PROJECT NETWORK</div><h1>{pageTitle}</h1><p>Orchestrate projects, shipyard capacity and execution evidence in one place.</p></div>
            <button className="primary-button" onClick={() => setShowNew(true)}><span>＋</span> New project</button>
          </div>

          {active === 'Dashboard' && (
            <>
              <section className="hero-banner">
                <div className="hero-copy"><div className="hero-tag">CONNECTED MARITIME DELIVERY</div><h2>From project opportunity<br />to <em>verified execution.</em></h2><p>One network connecting customer requirements, Kalimas project coordination and KSO shipyard capability.</p><button className="hero-button" onClick={() => setActive('Projects')}>Explore project portfolio <span>↗</span></button></div>
                <div className="hero-graphic" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="ship-symbol">船</div><div className="graphic-label label-top">PROJECT CONTROL <b>01</b></div><div className="graphic-label label-bottom">YARD NETWORK <b>CONNECTED</b></div><div className="graphic-cross">＋</div></div>
                <div className="hero-index">01 <span>/ 05</span></div>
              </section>

              <section className="metrics-grid">
                <Metric label="Active projects" value="03" change="Across demo portfolio" icon="▤" />
                <Metric label="Yard candidates" value="06" change="Across 3 demo locations" icon="⌘" />
                <Metric label="Scope readiness" value="82%" change="Weighted demo indicator" icon="◈" />
                <Metric label="Evidence verified" value="12" change="Demo records available" icon="◎" />
              </section>

              <section className="content-grid">
                <div className="panel project-panel">
                  <div className="panel-header"><div><div className="section-kicker">PROJECT CONTROL</div><h3>Active projects</h3></div><button className="text-button" onClick={() => setActive('Projects')}>View all <span>→</span></button></div>
                  <ProjectTable projects={projects.slice(0, 3)} onSelect={p => { setSelected(p); setActive('Vessel & Scope') }} />
                </div>
                <div className="panel network-panel">
                  <div className="panel-header"><div><div className="section-kicker">DELIVERY NETWORK</div><h3>Orchestration flow</h3></div><span className="live-label"><i /> DEMO</span></div>
                  <div className="flow-list">
                    <FlowStep n="01" title="Customer opportunity" detail="Requirements captured" state="Complete" />
                    <FlowStep n="02" title="Kalimas coordination" detail="Commercial · PM · engineering" state="Active" />
                    <FlowStep n="03" title="KSO yard matching" detail="Capacity & capability review" state="Review" />
                    <FlowStep n="04" title="Execution & evidence" detail="Quality and delivery records" state="Pending" last />
                  </div>
                </div>
              </section>
            </>
          )}

          {active === 'Projects' && (
            <section className="panel full-panel">
              <div className="panel-header"><div><div className="section-kicker">PORTFOLIO MANAGEMENT</div><h3>Project register</h3></div><span className="record-count">03 DEMO RECORDS</span></div>
              <div className="table-tools"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project, client or vessel..." /><span>{filtered.length} projects shown</span></div>
              <ProjectTable projects={filtered} onSelect={p => { setSelected(p); setActive('Vessel & Scope') }} />
            </section>
          )}

          {active === 'Vessel & Scope' && (
            <section className="detail-layout">
              <div className="panel detail-main"><div className="section-kicker">VESSEL PROFILE · {selected.id}</div><h2>{selected.vessel}</h2><p className="muted">{selected.name}</p><div className="detail-stats"><div><small>Client</small><strong>{selected.client}</strong></div><div><small>Project budget</small><strong>{selected.budget}</strong></div><div><small>Project status</small><strong>{selected.status}</strong></div></div><div className="subheading">Scope of work</div>{['Hull & structural inspection','Mechanical and propulsion systems','Electrical and auxiliary systems','Quality assurance and sea-trial readiness'].map((s,i)=><div className="scope-row" key={s}><span className="scope-check">{i < 2 ? '✓' : '○'}</span><span>{s}</span><span className={`scope-state ${i < 2 ? 'done' : ''}`}>{i < 2 ? 'Defined' : 'To assess'}</span></div>)}<div className="subheading">Delivery progress</div><div className="progress-line"><span style={{width:`${selected.progress}%`}} /></div><div className="progress-meta"><span>Demo progress indicator</span><strong>{selected.progress}%</strong></div></div>
              <div className="panel side-detail"><div className="section-kicker">PROJECT ROUTING</div><h3>Coordination status</h3><div className="route-step"><span className="route-number done">1</span><div><strong>Customer intake</strong><small>Requirements received</small></div></div><div className="route-step"><span className="route-number done">2</span><div><strong>Scope definition</strong><small>Initial scope prepared</small></div></div><div className="route-step"><span className="route-number">3</span><div><strong>Yard capability match</strong><small>{selected.yard}</small></div></div><div className="route-step"><span className="route-number">4</span><div><strong>Execution plan</strong><small>Pending yard confirmation</small></div></div><button className="primary-button wide" onClick={() => setActive('KSO Matching')}>Review yard matches →</button></div>
            </section>
          )}

          {active === 'KSO Matching' && (
            <section className="panel full-panel"><div className="panel-header"><div><div className="section-kicker">CAPABILITY-BASED SELECTION</div><h3>Candidate shipyards</h3></div><span className="record-count">ILLUSTRATIVE DATA</span></div><p className="muted">Demo scores are illustrative only. Real matching requires verified yard data and project constraints.</p><div className="yard-grid"><YardCard name="KSO Yard A" location="Demo location · East Indonesia" score="92" fit="Strong fit" tags={['Docking','Mechanical','Heavy lift']} onClick={() => setActive('KSO Evidence')} /><YardCard name="KSO Yard B" location="Demo location · Central Indonesia" score="84" fit="Good fit" tags={['Workshop','Steel works','Repair']} onClick={() => setActive('KSO Evidence')} /><YardCard name="KSO Yard C" location="Demo location · West Indonesia" score="71" fit="Needs review" tags={['Slipway','Electrical','Fabrication']} onClick={() => setActive('KSO Evidence')} /></div><div className="matching-note"><span>ⓘ</span><div><strong>Matching criteria</strong><p>Vessel dimensions, docking access, equipment, workforce, schedule and verified supporting evidence.</p></div></div></section>
          )}

          {active === 'KSO Evidence' && (
            <section className="panel full-panel"><div className="panel-header"><div><div className="section-kicker">KSO YARD PROFILE</div><h3>KSO Yard A — evidence register</h3></div><span className="status-chip review">Demo review</span></div><div className="evidence-summary"><div><small>Capability match</small><strong>92 / 100</strong></div><div><small>Evidence records</small><strong>04</strong></div><div><small>Verification status</small><strong>Illustrative</strong></div></div><div className="evidence-list">{[['Facility overview','Dock / slipway specification','Pending verification'],['Equipment register','Crane and lifting capacity','Pending verification'],['Workforce profile','Certified skills and availability','Pending verification'],['Quality documentation','HSE / QA procedures and certificates','Pending verification']].map((r,i)=><div className="evidence-row" key={r[0]}><div className="evidence-file">PDF</div><div className="evidence-name"><strong>{r[0]}</strong><small>{r[1]}</small></div><span className="status-chip review">{r[2]}</span><button className="small-outline" onClick={() => alert('Demo only: no actual document is attached.')}>View record</button></div>)}</div><div className="matching-note"><span>!</span><div><strong>Evidence is not yet verified</strong><p>All yard details on this screen are sample data, not claims about an actual KSO facility.</p></div></div></section>
          )}
          <footer className="footer"><span>© 2026 KALIMAS MARITIME HUB</span><span>DEMO BUILD <b>•</b> NOT FOR OPERATIONAL DECISIONS</span></footer>
        </div>
      </main>

      {showNew && <div className="modal-backdrop" onClick={() => setShowNew(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowNew(false)}>×</button><div className="section-kicker">PROJECT INTAKE</div><h2>New demo project</h2><p>Register a sample opportunity for the Maritime Hub walkthrough.</p><label>Project name<input placeholder="e.g. Vessel repair and maintenance" /></label><label>Vessel type<select defaultValue=""><option value="" disabled>Select vessel type</option><option>Tugboat</option><option>Cargo vessel</option><option>Landing craft</option><option>Offshore support vessel</option></select></label><div className="modal-note">This demo form is visual only; it does not save to a database.</div><button className="primary-button wide" onClick={() => { setShowNew(false); setActive('Projects') }}>Return to portfolio</button></div></div>}
    </div>
  )
}

function Metric({ label, value, change, icon }) {
  return <div className="metric-card"><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><div className="metric-foot"><span className="metric-accent" />{change}</div></div>
}

function ProjectTable({ projects, onSelect }) {
  return <div className="table-wrap"><table className="project-table"><thead><tr><th>PROJECT</th><th>VESSEL / CLIENT</th><th>STATUS</th><th>PROGRESS</th><th></th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td><button className="project-link" onClick={() => onSelect(p)}>{p.id}<strong>{p.name}</strong></button></td><td><span>{p.vessel}</span><small>{p.client}</small></td><td><span className={`status-chip ${p.status === 'Engineering' ? 'blue' : p.status === 'Procurement' ? 'green' : 'review'}`}>{p.status}</span></td><td><div className="table-progress"><span style={{width:`${p.progress}%`}} /></div><small>{p.progress}%</small></td><td><button className="row-arrow" onClick={() => onSelect(p)}>↗</button></td></tr>)}</tbody></table>{projects.length === 0 && <div className="empty-state">No matching demo projects found.</div>}</div>
}

function FlowStep({ n, title, detail, state, last }) {
  return <div className={`flow-step ${last ? 'last' : ''}`}><div className="flow-number">{n}</div><div className="flow-info"><strong>{title}</strong><small>{detail}</small></div><span className={`flow-state ${state.toLowerCase()}`}>{state}</span></div>
}

function YardCard({ name, location, score, fit, tags, onClick }) {
  return <div className="yard-card"><div className="yard-top"><div className="yard-icon">⌂</div><span className="record-count">DEMO</span></div><h3>{name}</h3><p>{location}</p><div className="yard-score"><strong>{score}<small>/100</small></strong><span>{fit}</span></div><div className="yard-tags">{tags.map(t=><span key={t}>{t}</span>)}</div><button className="text-button" onClick={onClick}>Review evidence <span>→</span></button></div>
}

export default App



