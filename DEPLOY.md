# Deploying NotAlone

## Architecture

```
User Browser  ─WebSocket─►  Cloudflare Worker (Edge)
                                   │
                           Durable Object per room
                           (global, us, uk, pk …)
                           Hibernatable WebSockets
                           → handles millions cheaply
```

---

## 1 — Deploy the Worker (Cloudflare)

### One-time setup
1. Create a free Cloudflare account at cloudflare.com
2. Install Wrangler CLI:
   ```
   npm install -g wrangler
   wrangler login
   ```

### Deploy
```bash
cd worker
npm install
npm run deploy
```

After deploy, Wrangler prints your worker URL:
```
https://notalone-worker.YOUR_SUBDOMAIN.workers.dev
```

### Local development
```bash
cd worker
npm run dev
# Worker runs at http://localhost:8787
```

---

## 2 — Deploy the Frontend (Cloudflare Pages — FREE)

### Setup
1. Go to cloudflare.com → Pages → Create project
2. Connect your GitHub repo
3. Build settings:
   - Framework: Next.js
   - Build command: `cd frontend && npm run build`
   - Output directory: `frontend/.next`
4. Add environment variable:
   ```
   NEXT_PUBLIC_WORKER_URL = wss://notalone-worker.YOUR_SUBDOMAIN.workers.dev
   ```

### Local development
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local: set NEXT_PUBLIC_WORKER_URL=ws://localhost:8787

npm install
npm run dev
# Frontend at http://localhost:3000
```

---

## Scaling to Millions

The stack is already designed for this:

| Concern | Solution |
|---------|---------|
| WebSocket scale | Cloudflare Durable Objects — Hibernatable WS, 32K+ per instance |
| Global distribution | Cloudflare edge — 300+ data centers worldwide |
| High-traffic rooms | Add room sharding: `global-0` to `global-9` in worker |
| Cost at scale | Hibernatable WS = near-zero idle cost |

### Room sharding (when global hits 30K+ concurrent)
In `worker/src/index.ts`, change the global room routing:
```typescript
// Distribute global users across 10 shards
const shard = Math.floor(Math.random() * 10);
const room = rawRoom === "global" ? `global-${shard}` : rawRoom;
```

---

## Monthly Cost Estimates

| Scale | Cloudflare Workers | Cloudflare Pages | Total |
|-------|--------------------|-----------------|-------|
| 0–100K req/day | FREE | FREE | $0 |
| Millions req/day | ~$5 (Workers paid) | FREE | ~$5 |
| Extreme scale | ~$20–50 | FREE | ~$20–50 |

Cloudflare Workers paid plan: $5/mo for 10M requests.
Durable Objects: ~$0.15 per million requests + $0.20/GB-hour storage.

---

## Monetization Ideas

1. **Premium badge** — $3/mo for custom username color, no system messages
2. **Country room sponsorship** — local mental health brands pay to sponsor their country's room
3. **Therapist directory** — mental health professionals listed as "available now"
4. **Donation button** — many users will donate if the app genuinely helped them
5. **Google AdSense** — add to landing page only (not chat — ruins trust)
