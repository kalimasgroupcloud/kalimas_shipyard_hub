import { href, useRouter } from '../router.js'

// BASE_URL is './' on GH Pages / any sub-path deploy; join explicitly so the
// logo resolves whether served from root domain or a sub-folder.
const LOGO_SRC = `${import.meta.env.BASE_URL}kalimas-logo-transparent.png`

export function Logo() {
  return (
    <a className="mk-logo" href={href('/')}>
      <img src={LOGO_SRC} alt="Kalimas Shipyard Hub" />
      <span className="mk-logo-text">
        <b>Kalimas Shipyard Hub</b>
        <small>MARITIME MARKETPLACE</small>
      </span>
    </a>
  )
}

export function Header({ query, setQuery }) {
  const { page, navigate } = useRouter()
  const link = (to, label) => (
    <a href={href(to)} className={page === to.replace('/', '') ? 'active' : ''}>{label}</a>
  )
  return (
    <>
      <div className="mk-topbar">
        <div className="mk-container mk-topbar-inner">
          <div className="mk-topbar-left">
            <span>⚓ 320+ verified shipyards nationwide</span>
            <span>🔒 Escrow-secured payments</span>
          </div>
          <div className="mk-topbar-right">
            <a href="https://www.kalimasgroup.com" target="_blank" rel="noreferrer">kalimasgroup.com</a>
            <a className="lk-topbar-cta" href={href('/launch')}>✦ Launch Invitation</a>
            <a href={href('/dashboard')}>Sign in</a>
            <a href={href('/join')}>Join as shipyard</a>
          </div>
        </div>
      </div>
      <header className="mk-header">
        <div className="mk-container mk-header-inner">
          <Logo />
          <form className="mk-search" onSubmit={(e) => { e.preventDefault(); navigate(`/directory?q=${encodeURIComponent(query)}`) }}>
            <span>🔍</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shipyards, vessels, services…" />
            <button className="mk-search-go" type="submit" aria-label="Search">→</button>
          </form>
          <nav className="mk-nav">
            {link('/', 'Home')}
            {link('/directory', 'Shipyards')}
            {link('/rfq', 'RFQ Board')}
            {link('/compliance', 'Compliance')}
            {link('/dashboard', 'Dashboard')}
          </nav>
          <div className="mk-header-cta">
            <a className="mk-btn mk-btn-primary" href={href('/post')}>Post an RFQ</a>
          </div>
        </div>
      </header>
    </>
  )
}

export function Footer() {
  const { navigate } = useRouter()
  return (
    <footer className="mk-footer">
      <div className="mk-container">
        <div className="mk-footer-grid">
          <div>
            <div className="brand-row">
              <img src={LOGO_SRC} alt="Kalimas" />
              <b>Kalimas Shipyard Hub</b>
            </div>
            <p>The maritime B2B marketplace connecting ship owners and SIUPAL holders with a nationwide network of verified shipyards. Based in Balikpapan — the gateway to Indonesia's new capital.</p>
          </div>
          <div>
            <h5>Marketplace</h5>
            <ul>
              <li><a href={href('/directory')}>Browse shipyards</a></li>
              <li><a href={href('/rfq')}>Open RFQs</a></li>
              <li><a href={href('/rfq')}>Post a project</a></li>
              <li><a href={href('/directory')}>Capacity matrix</a></li>
            </ul>
          </div>
          <div>
            <h5>For Partners</h5>
            <ul>
              <li><a href={href('/join')}>Join as shipyard</a></li>
              <li><a href={href('/compliance')}>SIUPAL verification</a></li>
              <li><a href={href('/dashboard')}>Escrow & payments</a></li>
              <li><a href={href('/join')}>Become an operator</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="https://www.kalimasgroup.com" target="_blank" rel="noreferrer">Kalimas Group</a></li>
              <li><a href={href('/')}>About the Hub</a></li>
              <li><a href={href('/')}>Trust & safety</a></li>
              <li><a href={href('/')}>Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mk-footer-bottom">
          <span>© 2026 PT Kalimas Group · Kalimas Shipyard Hub — DEMO BUILD, not for operational decisions.</span>
          <div className="socials">
            <a href="#/" aria-label="Web" onClick={(e) => { e.preventDefault(); navigate('/') }}>🌐</a>
            <a href="#/" aria-label="Email" onClick={(e) => e.preventDefault()}>✉️</a>
            <a href="#/" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>in</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
