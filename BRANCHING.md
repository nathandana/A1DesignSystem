# Branching & release strategy

A lightweight flow so every ticket ships on its own branch **and** everything can be
tried together locally before anything lands on `main`.

## Branches

| Branch | Role |
|--------|------|
| `main` | Production-ready. Only updated via reviewed PRs. The base for every new branch. |
| per-ticket branches | One branch per ticket/task, cut from `main`. Named for the ticket (e.g. `a1-176-virtual-architect`) or the work (`build-with-ai-local-plan`). |
| `release` | Long-lived **integration** branch. Every feature branch is merged here so the whole set can be run and checked locally before it reaches `main`. **This is also where the version is bumped.** Never the base for new work. |

## Versioning — bump on `release`, not on feature branches

The version is cut **once, on `release`**, when a set of work is ready — not on each feature
branch. So:

- **Feature branches do NOT touch `package.json` versions.** They add their changelog
  entry under the **`## Unreleased`** heading (no dated `## x.y.z` section), and add their
  `components-maintenance.md` row as usual.
- **`release` bumps the versions** (`apps/a1-web/package.json`, `packages/react/package.json`)
  and **cuts the dated changelog section** (`## Unreleased` → `## x.y.z — <date>`), folding in
  every integrated branch's Unreleased entries.

This keeps all the in-flight branches at the same base version, so they never collide on the
version line when their PRs merge to `main` one at a time.

## Flow for each ticket

The branch is **not** closed out or merged the moment the work compiles. Finish, then
**pause for refinement** — iterate on the branch until it's signed off — and only merge
**after** an explicit OK.

1. **Branch from `main`:**
   ```sh
   git checkout main && git pull
   git checkout -b <ticket-or-topic>
   ```
2. Do the work. Add the changelog entry under **`## Unreleased`** and a
   `components-maintenance.md` row — **but do not bump any `package.json` version** (that
   happens on `release`). Commit on the branch as you go.
3. **Pause when done — do not push or merge yet.** Summarise what changed and hand it back
   for review. Refine on the same branch (more commits) until it's finalised. The branch
   stays local during this phase; nothing is integrated.
4. **When finalised, ask before merging.** Only on an explicit OK:
   - push the branch for review (its own PR to `main`):
     ```sh
     git push -u origin <ticket-or-topic>
     ```
   - integrate it into `release` so everything can be tested together:
     ```sh
     git checkout release
     git merge --no-ff origin/<ticket-or-topic> -m "Integrate <ticket-or-topic> into release"
     # resolve any changelog / maintenance-log conflicts (combine entries),
     # bump the affected package.json version(s) + cut/extend the dated changelog
     # section here on release, then rebuild so dist isn't a mix of per-branch builds:
     rm -rf apps/a1-web/dist && npm run build --workspace=apps/a1-web
     git add -A && git commit
     git push origin release
     ```
5. **Check it locally** on `release`:
   ```sh
   git checkout release
   npm run dev:a1-web      # everything integrated, at http://127.0.0.1:5177/
   ```

## Keeping `release` clean

`release` accumulates work that hasn't merged to `main` yet. Once the corresponding PRs
have merged to `main`, refresh `release` so it only carries what's still outstanding:

```sh
git checkout release
git fetch origin
git reset --hard origin/main          # drop everything already on main…
# …then re-merge only the branches still awaiting review:
git merge --no-ff origin/<still-open-branch> -m "Integrate <still-open-branch> into release"
rm -rf apps/a1-web/dist && npm run build --workspace=apps/a1-web
git add -A && git commit && git push --force-with-lease origin release
```

> `release` is disposable integration state — force-pushing it after a reset is expected.
> `main` is never force-pushed.

## Conflict notes

The files that conflict most when integrating several branches are predictable:

- **`apps/a1-web/CHANGELOG.md` / `packages/react/CHANGELOG.md`** — each branch adds an entry
  at the top. Resolve by **combining** the entries under one version section.
- **`packages/react/ai/components-maintenance.md`** — same: keep **all** new rows.
- **`apps/*/package.json` versions** — feature branches stay at the base version, so there's
  nothing to conflict; `release` is the only branch that bumps them.
- **`apps/a1-web/dist/**`** — built artifacts with content-hashed names. Don't hand-merge;
  resolve to either side and then `rm -rf apps/a1-web/dist && npm run build` once.
