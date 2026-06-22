# Branching & release strategy

A lightweight flow so every ticket ships on its own branch **and** everything can be
tried together locally before anything lands on `main`.

## Branches

| Branch | Role |
|--------|------|
| `main` | Production-ready. Only updated via reviewed PRs. The base for every new branch. |
| per-ticket branches | One branch per ticket/task, cut from `main`. Named for the ticket (e.g. `a1-176-virtual-architect`) or the work (`build-with-ai-local-plan`). |
| `release` | Long-lived **integration** branch. Every feature branch is merged here so the whole set can be run and checked locally before it reaches `main`. Never the base for new work. |

## Flow for each ticket

1. **Branch from `main`:**
   ```sh
   git checkout main && git pull
   git checkout -b <ticket-or-topic>
   ```
2. Do the work (bump the affected `package.json` version + update the changelog(s) as the
   repo rules require).
3. **Push the branch for review** (it becomes its own PR to `main`):
   ```sh
   git push -u origin <ticket-or-topic>
   ```
4. **Also integrate it into `release`** so you can test everything together locally:
   ```sh
   git checkout release
   git merge --no-ff origin/<ticket-or-topic> -m "Integrate <ticket-or-topic> into release"
   # resolve any changelog / maintenance-log / version conflicts (combine entries),
   # then rebuild the a1-web bundle so dist isn't a mix of per-branch builds:
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
- **`apps/*/package.json` versions** — pick the highest appropriate bump for the release.
- **`apps/a1-web/dist/**`** — built artifacts with content-hashed names. Don't hand-merge;
  resolve to either side and then `rm -rf apps/a1-web/dist && npm run build` once.
