# Dayflow — AI Day Planner

Dayflow connects your calendars, errands, and live traffic data to build an optimized plan for your day. It tells you when to leave, orders your stops efficiently, and works around fixed appointments.

## Features

- **Multi-calendar sync** — Connect Google, Apple, and Outlook calendars (demo uses simulated OAuth)
- **Errand management** — Add destinations with duration, priority, and optional time windows
- **Traffic-aware routing** — Drive times adjust by time of day and congestion patterns
- **Route optimization** — Nearest-neighbor + 2-opt ordering minimizes backtracking
- **AI insights** — Natural-language summary of your plan, departure times, and traffic alerts
- **Leave-by reminders** — Know exactly when to head out for your next stop

## Run locally

From the repo root:

```sh
export PATH="$PWD/.tools/node/bin:$PATH"
npm run dev:dayflow
```

Open http://127.0.0.1:5183/examples/dayflow/

## Build

```sh
npm run build:dayflow
```

## Deploy to the cloud (Netlify)

Dayflow is a static SPA — no server or API keys required. Everything runs in the browser (localStorage, simulated calendars, client-side optimization).

**Option A — deploy from the example folder (recommended)**

1. In [Netlify](https://www.netlify.com/), create a new site from this repo.
2. Set **Base directory** to `examples/dayflow`.
3. Netlify reads `examples/dayflow/netlify.toml` automatically:
   - Build command: `npm run netlify:build`
   - Publish directory: `dist`

**Option B — deploy from the repo root**

Update the root `netlify.toml` to:

```toml
[build]
  command = "npm run build:dayflow"
  publish = "examples/dayflow/dist"
```

Then connect the repo to Netlify as usual.

The app also works on Vercel, Cloudflare Pages, or any static host — build with `npm run build:dayflow` and serve `examples/dayflow/dist`.
