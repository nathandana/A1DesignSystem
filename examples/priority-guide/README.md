# Priority Guide

A content-first planning app built with the local A1 design system.

## Local development

From this folder:

```bash
npm run dev
```

The app runs through the repository root so it can keep using the local A1 source files, tokens, and themes.

## Build

```bash
npm run build
```

The production build is written to:

```text
dist
```

## Netlify

Create a separate Netlify site for this app and set the base directory to:

```text
examples/priority-guide
```

Netlify will use this folder's `netlify.toml`.

Build command:

```bash
npm run netlify:build
```

Publish directory:

```text
dist
```
