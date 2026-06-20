# A1 Design System — design-sync notes

## General

- **[GENERAL] Package entry has no aggregated `.d.ts`.** `packages/react` `exports['.']` → `src/index.js` (JS re-exports); each component ships a co-located `Button.d.ts` etc., but there was **no `src/index.d.ts`**, so `exportedNames` (ts-morph on the entry) returned 0 and the converter found 0 components. Fix: generated `packages/react/src/index.d.ts` mirroring `index.js`'s re-exports (extension dropped so TS resolves the `.d.ts`) and added `"types": "./src/index.d.ts"` to `packages/react/package.json`. → 56/87 storybook components now detected.
- React is **19.2.6** (the bundle logs "react@19.2.6 has no UMD — bundling via esbuild"). Compare/preview runtime so far OK.

## Re-sync risks / remaining work (status checkpoint — NOT a completed sync)

- **`titleMap` still needed** for 31 storybook titles whose story title ≠ export name (dropped as `[TITLE_UNMAPPED]`): e.g. `Badge` → `MessageBadge`, `EmptyState` → `MessageEmptyState`, `Select` → `SelectField`, `Textarea` → `TextareaField`, `Inline` → (inline text helpers), `_MessageBanner` → exclude (`{title: null}`). Add `cfg.titleMap` entries.
- **Field-family components** (`DateField`, `TimeField`, `PhoneField`, `ZipField`, `CreditCardField`) and a few others (`Labels`, `TopHeader`, `TokenSelect`, `DataTableFilters`) are exported from `index.js` but ship **no `.d.ts`** — they were skipped from `index.d.ts` and aren't in the detected 56. They build/share via `createFieldModule`/`TextField`; give them `.d.ts` (or `cfg.titleMap`/`dtsPropsFor`) to include them with props.
- **Not yet done:** the §3 self-heal (titleMap), §4 compare/grade fidelity loop (fan-out across 56 components vs. the reference storybook), conventions header, and the §6 atomic upload to project `ce1af259-…`. This run got the converter producing components; the verification + upload still need to run.
