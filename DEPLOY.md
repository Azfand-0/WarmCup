# Deploying WarmCup

## Architecture

```
User Browser  ─WebSocket─►  Cloudflare Worker  (Workers tab)
                                   │
                           Durable Object per room
                           Hibernatable WebSockets

User Browser  ─HTTPS──────►  Cloudflare Pages   (Pages tab)
                           Next.js frontend
                           Auto-deploys from GitHub
```

---

## PART 1 — Deploy the Worker (Cloudflare Workers tab)

> Do this FIRST. The frontend needs the worker URL.

### Step 1 — Install Wrangler and log in
```bash
npm install -g wrangler
wrangler login
# Opens browser → log in with your Cloudflare account → Authorize
```

### Step 2 — Deploy the worker
```bash
cd worker
npm install
npm run deploy
```

Wrangler prints your worker URL when done:
```
https://warmcup-worker.YOUR_SUBDOMAIN.workers.dev
```
**Copy this URL — you need it in Part 2.**

### Step 3 — Verify it works
Open in browser:
```
https://warmcup-worker.YOUR_SUBDOMAIN.workers.dev
```
You should see: `warmcup worker`

---

## PART 2 — Push code to GitHub

### Step 1 — Create a GitHub repo
1. Go to **github.com** → click **+** (top right) → **New repository**
2. Name it: `warmcup`
3. Set to **Private** (recommended)
4. Do NOT tick "Add README" — leave it empty
5. Click **Create repository**
6. Copy the repo URL shown (looks like `https://github.com/YOURNAME/warmcup.git`)

### Step 2 — Push your code
Run these commands from inside `C:\PANIC`:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOURNAME/warmcup.git
git push -u origin main
```
> Replace `YOURNAME/warmcup` with your actual GitHub repo URL.

---

## PART 3 — Deploy the Frontend (Cloudflare Pages tab)

> This is separate from Workers. Pages = your website. Workers = your backend.

### Step 1 — Open Cloudflare Pages
1. Go to **dash.cloudflare.com**
2. In the left sidebar click **Workers & Pages**
3. Click the **Pages** tab at the top
4. Click **Create a project**
5. Click **Connect to Git**

### Step 2 — Connect GitHub
1. Click **Connect GitHub**
2. Authorize Cloudflare to access your GitHub account
3. Select your `warmcup` repository
4. Click **Begin setup**

### Step 3 — Configure build settings
Fill in exactly like this:

| Field | Value |
|-------|-------|
| Project name | `warmcup` |
| Production branch | `main` |
| Framework preset | `Next.js` |
| Build command | `cd frontend && npm install && npm run build` |
| Build output directory | `frontend/.next` |

### Step 4 — Add environment variable
Still on the same setup page, scroll down to **Environment variables**:

Click **Add variable** and enter:
```
Variable name:   NEXT_PUBLIC_WORKER_URL
Value:           wss://warmcup-worker.YOUR_SUBDOMAIN.workers.dev
```
> Use `wss://` (not `ws://` or `https://`). Replace with your real worker URL from Part 1.

### Step 5 — Deploy
Click **Save and Deploy**.

Cloudflare will:
1. Pull your code from GitHub
2. Run `npm run build`
3. Publish your site

Takes 2–4 minutes. When done it gives you a URL like:
```
https://warmcup.pages.dev
```

### Step 6 — Connect your custom domain (warmcup.app)
1. In Cloudflare Pages → your project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `warmcup.app`
4. Follow the DNS instructions (if your domain is already on Cloudflare it's automatic)

---

## Auto-deploy on every push

Once connected, every time you run:
```bash
git add .
git commit -m "update"
git push
```
Cloudflare Pages automatically rebuilds and redeploys your site. No manual steps.

---

## Local development

```bash
# Terminal 1 — run the worker backend
cd worker
npm run dev
# Runs at http://localhost:8787

# Terminal 2 — run the frontend
cd frontend
cp .env.example .env.local   # only needed first time
npm install                  # only needed first time
npm run dev
# Runs at http://localhost:3000
```

---

## Monthly Cost

| Scale | Workers | Pages | Total |
|-------|---------|-------|-------|
| Launch (0–100K req/day) | FREE | FREE | **$0** |
| Growing (millions/day) | ~$5 | FREE | **~$5** |
| Large scale | ~$20–50 | FREE | **~$20–50** |
