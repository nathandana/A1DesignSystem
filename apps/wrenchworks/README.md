# Wrenchworks

Wrenchworks is a standalone, mobile-first idle mechanic game for
`garage.a1design.app`. It uses A1 for interface controls and original
illustrated graphics for the playable garage. The game runs in a fixed
single-screen shell: tap the floor, use the mobile joystick, or use WASD and
arrow keys to walk the mechanic between physical workstations. Management
panels open in place instead of navigating to separate pages.

Play the production game at [garage.a1design.app](https://garage.a1design.app).

## Play locally

From the repository root:

```sh
npm run dev:wrenchworks
```

Open `http://127.0.0.1:5190/`.

## Build and test

```sh
npm run test:wrenchworks
npm run build:wrenchworks
```

## Saves and idle progress

The game saves to local browser storage. Hired crew members earn money and
reputation while the game is closed, with each return calculating up to 12
hours of elapsed progress. No account, analytics, ads or third-party game
services are used.

## Controls

- Tap or click the workshop floor to walk there.
- Drag the mobile joystick on touch screens.
- Use WASD or the arrow keys with a keyboard.
- Walk near Tools, Office, or City and press E/Enter—or use the contextual
  action—to open that station.
- Follow the active contract across the workshop, city test route, and salvage
  yard.
- Steer the service car on road contracts, avoid hazards, and hold Boost on
  clear stretches.
- Use the salvage radar and compass to hunt hidden parts.

## Contracts

The dispatch board rotates roadside rescues, timed performance tests, rare
parts hunts, auction flips, fleet emergencies, and mystery-diagnostic jobs.
Fast completion builds a payout streak; hazards add time penalties. Contract
rewards scale with the currently active business, so field work stays useful
through the full empire.

## Netlify

The app follows the standalone `apps/tesla-a1` pattern. The Netlify project is
`wrenchworks-a1`, linked from `apps/wrenchworks`, and the managed custom domain
is `garage.a1design.app`.
