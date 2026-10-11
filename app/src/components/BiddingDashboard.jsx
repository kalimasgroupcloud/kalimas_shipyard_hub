import { useMemo } from 'react'

// Parse a bid price (raw number or "Rp 5,200,000" string) into a number.
function toNum(v) {
  if (typeof v === 'number') return v
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  return isNaN(n) ? 0 : n
}

// Compact IDR formatter: 4620000 -> "Rp 4.62 M", 98000000 -> "Rp 98 M"
function rp(n) {
  const v = toNum(n)
  if (v >= 1e9) return 'Rp ' + (v / 1e9).toFixed(2) + ' B'
  if (v >= 1e6) {
    const m = v / 1e6
    return 'Rp ' + (m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)) + ' M'
  }
  return 'Rp ' + v.toLocaleString('id-ID')
}

function parseDuration(d) {
  const n = parseInt(String(d).replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? 0 : n
}

// Real-Time Dynamic Bidding Dashboard: cost projection, AI delivery timeline,
// and a live bid feed. Reads rfq.bidList so bids placed on this page (via the
// store's addBid) appear here instantly.
export function BiddingDashboard({ rfq }) {
  const bids = rfq.bidList || []

  const stats = useMemo(() => {
    const list = rfq.bidList || []
    const prices = list.map(b => toNum(b.price)).filter(n => n > 0)
    if (!prices.length) return null
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    const durations = list.map(b => parseDuration(b.duration)).filter(n => n > 0)
    return {
      min, max, avg, spread: max - min,
      bestValue: [...list].sort((a, b) => toNum(a.price) - toNum(b.price))[0],
      fastest: durations.length ? Math.min(...durations) : 0,
      slowest: durations.length ? Math.max(...durations) : 0,
    }
  }, [rfq.bidList])

  if (!bids.length) {
    return (
      <div className="mk-panel">
        <div className="mk-panel-head"><h3>Live bidding dashboard</h3><span className="mk-tag">Awaiting bids</span></div>
        <p style={{ color: 'var(--km-muted)', fontSize: 13, marginBottom: 0 }}>No bids yet. Be the first shipyard to quote this project — your bid appears here instantly with cost projection and delivery timeline.</p>
      </div>
    )
  }

  const maxPrice = stats.max
  const maxDur = stats.slowest

  return (
    <div className="mk-panel mk-bidding">
      <div className="mk-panel-head">
        <h3>Live bidding dashboard</h3>
        <span className="mk-tag">{bids.length} bid{bids.length > 1 ? 's' : ''} · closes {rfq.deadline}</span>
      </div>

      <div className="mk-bid-kpis">
        <div className="kpi"><small>Lowest bid</small><b className="low">{rp(stats.min)}</b></div>
        <div className="kpi"><small>Average</small><b>{rp(stats.avg)}</b></div>
        <div className="kpi"><small>Highest</small><b>{rp(stats.max)}</b></div>
        <div className="kpi"><small>Best value</small><b className="bv">{stats.bestValue.yard}</b></div>
      </div>

      <h4 className="mk-bid-h">Cost projection <span>lower is better for the buyer</span></h4>
      <div className="mk-chart">
        {[...bids].sort((a, b) => toNum(a.price) - toNum(b.price)).map((b, i) => {
          const w = maxPrice ? Math.max(8, (toNum(b.price) / maxPrice) * 100) : 8
          return (
            <div className="mk-bar-row" key={i}>
              <span className="mk-bar-label">{b.yard}</span>
              <div className="mk-bar-track">
                <div className={`mk-bar ${i === 0 ? 'best' : ''}`} style={{ width: w + '%' }}>
                  {b.ai && <em>AI ✓</em>}
                </div>
              </div>
              <span className="mk-bar-val">{rp(b.price)}</span>
            </div>
          )
        })}
      </div>

      <h4 className="mk-bid-h">AI delivery timeline <span>estimated days to complete</span></h4>
      <div className="mk-timeline">
        {[...bids].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration)).map((b, i) => {
          const d = parseDuration(b.duration)
          const w = maxDur ? Math.max(10, (d / maxDur) * 100) : 10
          return (
            <div className="mk-bar-row" key={i}>
              <span className="mk-bar-label">{b.yard}</span>
              <div className="mk-bar-track">
                <div className={`mk-bar dur ${i === 0 ? 'fast' : ''}`} style={{ width: w + '%' }}>
                  <em>{d}d</em>
                </div>
              </div>
              <span className="mk-bar-val">{b.duration}</span>
            </div>
          )
        })}
      </div>

      <h4 className="mk-bid-h">Live bid feed</h4>
      <div className="mk-bid-feed">
        {bids.map((b, i) => (
          <div className={`mk-ms ${b.ai ? 'ai' : ''}`} key={i}>
            <span className="mk-ms-dot" style={{ background: b.ai ? '#fdeef0' : '#eef1f5' }}>{b.ai ? '🤖' : '⚓'}</span>
            <div className="mk-ms-info">
              <b>{b.yard} {b.ai && <span className="mk-ai-badge">AI recommended</span>}</b>
              <small>{b.tier} · {b.warranty} warranty · ★ {b.rating} · {b.when}</small>
            </div>
            <div className="mk-ms-right">
              <div className="mk-ms-amount">{rp(b.price)}</div>
              <span className="mk-ms-status released">{b.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
