# To-Do List

A small task-tracking app built entirely from the local A1 design system. Tasks
are persisted to `localStorage`, so they survive a page reload.

It demonstrates composing field, button, layout, and messaging components into a
familiar, interactive product surface.

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
examples/todo-list
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
