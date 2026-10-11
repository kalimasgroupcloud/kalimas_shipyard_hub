import { useState } from 'react'
import { useRouter } from './router.js'
import { Header, Footer } from './components/Layout.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { DirectoryPage } from './pages/DirectoryPage.jsx'
import { RfqBoardPage, RfqDetailPage } from './pages/RfqPages.jsx'
import { YardDetailPage } from './pages/YardDetailPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { PostRfqPage } from './pages/PostRfqPage.jsx'
import { CompliancePage } from './pages/CompliancePage.jsx'
import { OnboardingPage } from './pages/OnboardingPage.jsx'
import { EscrowPage } from './pages/EscrowPage.jsx'
import { LaunchPage } from './pages/LaunchPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'

// Kalimas Shipyard Hub — marketplace application shell.
// Dependency-free hash router renders the public marketplace + dashboard.
function App() {
  const { page, subId, params } = useRouter()
  const [query, setQuery] = useState('')

  // Scroll to top on route change
  if (typeof window !== 'undefined') window.scrollTo(0, 0)

  let view
  switch (page) {
    case 'directory':
      view = <DirectoryPage params={params} />
      break
    case 'rfq':
      view = subId ? <RfqDetailPage subId={subId} /> : <RfqBoardPage />
      break
    case 'post':
      view = <PostRfqPage />
      break
    case 'compliance':
      view = <CompliancePage />
      break
    case 'join':
      view = <OnboardingPage />
      break
    case 'yard':
      view = <YardDetailPage subId={subId} />
      break
    case 'dashboard':
      view = <DashboardPage />
      break
    case 'escrow':
      view = <EscrowPage />
      break
    case 'launch':
      view = <LaunchPage />
      break
    case 'auth':
      view = <AuthPage />
      break
    case 'home':
    default:
      view = <HomePage query={query} setQuery={setQuery} />
  }

  return (
    <div className="mk-shell">
      <Header query={query} setQuery={setQuery} />
      <main>{view}</main>
      <Footer />
    </div>
  )
}

export default App
