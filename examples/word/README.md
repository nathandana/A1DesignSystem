# Word finder

A fast word finder for Scrabble-style games, planned for
`word.a1design.app`. Type the tiles on your rack and, optionally, a letter
already on the board. Every playable word is listed, highest score first.

- `?` or `*` is a blank tile. Blanks score 0 and are shown in the Notes column.
- **Starts with**, **Contains**, and **Ends with** take tiles already on the
  board. Each is a run of adjacent letters: the word starts and ends with those
  letters, and has the "Contains" letters somewhere between them. Board letters score their face value but don't count
  as rack tiles. A word must use at least one rack tile.
- Using all 7 rack tiles adds the 50-point bingo bonus.
- Scores are face values before board multipliers.
- The letters field has focus on load. Typing a letter while nothing editable
  has focus sends it to that field. The **Reset** icon button beside the heading clears every field and the
  results and returns focus to the letters field.

The dictionary is the public-domain ENABLE word list
(`src/data/enable1.txt`, 172,823 words). It is close to, but not the same as,
official tournament dictionaries. Vite emits it as a separate, content-hashed
asset that the app fetches on load, so it is not bundled into the JavaScript.

The UI is built from A1 components (`Section`, `Card`, `Grid`, `TextField`,
`DefinitionList`, `DataTable`, `MessageEmptyState`, `Banner`). The only local
CSS is `styles.css`, which shows tile letters and result words in capitals like
game tiles. That's a deliberate exception to A1's no-uppercase rule; the
underlying text stays lowercase for screen readers and copy and paste.
Solver logic lives in `src/lib/solver.js` as pure functions.

## Local development

From this folder:

```bash
npm run dev
```

The app runs through the repository root at
`http://127.0.0.1:5187/examples/word/` so it can use the local A1 source files,
tokens, and themes.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

The production build is written to `dist`.

## Netlify

Create a separate Netlify site for this app and set the base directory to:

```text
examples/word
```

Netlify uses this folder's `netlify.toml` (build command
`npm run netlify:build`, publish directory `dist`). Then add the custom domain
`word.a1design.app`; the `a1design.app` zone is on Netlify DNS, so the record
and certificate are created automatically.
