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
