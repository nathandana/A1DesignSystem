# Tesla A1

Private Tesla analytics app for `tesla.a1design.app`.

## What it does

- Connects through Tesla's official Fleet API OAuth flow.
- Reads the signed-in account's vehicles.
- Shows status, state of charge, range, charging details, climate, odometer and location-aware telemetry when the granted scopes allow it.
- Falls back to demo data when the proxy is not configured, so the interface can be reviewed without touching a car.

Tesla requires a server-side code exchange because the token request uses the app client secret. Do not put `TESLA_CLIENT_SECRET` in browser code.

## Local run

1. Copy `.env.example` to `.env.local`.
2. Add the Tesla developer app credentials and redirect URI.
3. Start the proxy-backed app:

```sh
npm run serve --workspace=tesla-a1
```

The app runs at `http://127.0.0.1:5189/`.

For interface-only work, use:

```sh
npm run dev:tesla-a1
```

That runs the Vite app at `http://127.0.0.1:5188/` and uses demo data unless a compatible `/api/tesla` proxy is available.

## Tesla setup notes

Use the official Tesla Fleet API. The app requests `openid`, `offline_access`, `vehicle_device_data`, `vehicle_location` and `vehicle_charging_cmds`.

The first production redirect URI should be:

```text
https://tesla.a1design.app/api/tesla/oauth/callback
```

Fleet Telemetry is the better long-term path for high-frequency analytics because it avoids regular `vehicle_data` polling and reduces wakeups. This first version performs on-demand reads only.
