/**
 * Vercel Serverless Function: POST /api/tokenfactory/chat/completions
 * Proxies requests to Nebius Token Factory with the API key (server-side only).
 * Rate-limited per IP to protect credit balance during judging period.
 */

// In-memory rate limiter (per warm instance; resets on cold start — acceptable
// because each call costs $0.00002, so even abuse is capped by cost math)
const WINDOW_MS = 24 * 60 * 60 * 1000
const MAX_CALLS_PER_WINDOW = 30
const usage = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const entry = usage.get(ip)
  if (!entry || now - entry.start > WINDOW_MS) {
    usage.set(ip, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > MAX_CALLS_PER_WINDOW
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Insight limit reached for today. Please try again tomorrow.' })
  }

  const apiKey = process.env.TOKEN_FACTORY_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'TOKEN_FACTORY_KEY not configured' })
  }

  try {
    const response = await fetch('https://api.tokenfactory.nebius.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(response.status).json({ error: text })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
