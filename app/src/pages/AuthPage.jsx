import { useState } from 'react'
import { href, useRouter } from '../router.js'
import { useStore } from '../store-context.js'

// Kalimas Shipyard Hub — Sign in / Sign up.
// Deliberately frictionless per product decision: an email is enough to enter
// (no password complexity, no document gate). Google sign-in is simulated for
// the demo; production swaps it for the kalimasgroup.com OAuth handshake.
export function AuthPage() {
  const { user, signIn, signOut } = useStore()
  const { navigate } = useRouter()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', email: '' })
  const [role, setRole] = useState('shipowner')
  const [note, setNote] = useState('')

  const submitEmail = (e) => {
    e.preventDefault()
    if (!form.email) return
    signIn({ name: mode === 'signup' ? form.name : '', email: form.email, method: 'email', role })
    navigate('/dashboard')
  }

  const submitGoogle = () => {
    // Simulated Google account picker (demo).
    signIn({ name: 'Google User', email: form.email || 'user@gmail.com', method: 'google', role })
    navigate('/dashboard')
  }

  if (user) {
    return (
      <section className="mk-section">
        <div className="mk-container" style={{ maxWidth: 520 }}>
          <div className="mk-panel" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 46 }}>👤</div>
            <h2 style={{ fontSize: 24, margin: '8px 0 4px' }}>Signed in as {user.name}</h2>
            <p style={{ color: 'var(--km-muted)' }}>{user.email} · via {user.method === 'google' ? 'Google' : user.method === 'ossrba' ? 'OSS-RBA' : 'Email'}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <a className="mk-btn mk-btn-primary" href={href('/dashboard')}>Go to dashboard</a>
              <button className="mk-btn mk-btn-ghost" onClick={() => { signOut(); setNote('You have been signed out.') }}>Sign out</button>
            </div>
            {note && <p style={{ color: 'var(--km-muted)', marginTop: 14, fontSize: 13 }}>{note}</p>}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mk-section">
      <div className="mk-container mk-auth-wrap">
        <div className="mk-panel mk-auth-card">
          <div className="mk-auth-tabs">
            <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Sign in</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Create account</button>
          </div>

          <h2 style={{ fontSize: 24, margin: '18px 0 6px' }}>{mode === 'signin' ? 'Welcome back' : 'Join the Hub'}</h2>
          <p style={{ color: 'var(--km-muted)', fontSize: 14, marginTop: 0 }}>
            {mode === 'signin' ? 'Sign in to post RFQs, track escrow and manage your yard.' : 'Just your email — you can add documents later. No paperwork needed to start.'}
          </p>

          <button className="mk-auth-google" onClick={submitGoogle}>
            <span className="g">G</span> Continue with Google
          </button>

          <div className="mk-auth-divider"><span>or with email</span></div>

          <form onSubmit={submitEmail}>
            {mode === 'signup' && (
              <label className="mk-auth-field">
                Name (optional)
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name or company" />
              </label>
            )}
            <label className="mk-auth-field">
              Email
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.co.id" />
            </label>
            {mode === 'signup' && (
              <div className="mk-auth-role">
                <span>I am a…</span>
                <button type="button" className={role === 'shipowner' ? 'active' : ''} onClick={() => setRole('shipowner')}>🚢 Ship owner / SIUPAL</button>
                <button type="button" className={role === 'shipyard' ? 'active' : ''} onClick={() => setRole('shipyard')}>⚓ Shipyard</button>
              </div>
            )}
            <button className="mk-btn mk-btn-primary mk-btn-block" type="submit">
              {mode === 'signin' ? 'Sign in' : 'Create account — free'}
            </button>
          </form>

          <p className="mk-auth-fine">
            Demo build — no password required and no data leaves your browser. Production sign-in will use the
            kalimasgroup.com SSO + Google OAuth. Shipyard partners can also sign in via <a href={href('/join')}>OSS-RBA on the join page</a>.
          </p>
        </div>
      </div>
    </section>
  )
}