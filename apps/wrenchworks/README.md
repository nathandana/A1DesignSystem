# Wrenchworks

Wrenchworks is a standalone, mobile-first idle mechanic game for
`garage.a1design.app`. It uses A1 for interface controls and original
code-native graphics for the playable garage. The game runs in a fixed
single-screen shell with persistent app navigation and internally scrolling
panels.

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

## Netlify

The app follows the standalone `apps/tesla-a1` pattern. The Netlify project is
`wrenchworks-a1`, linked from `apps/wrenchworks`, and the managed custom domain
is `garage.a1design.app`.
