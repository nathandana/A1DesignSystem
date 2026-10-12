# A1 Labs — agent instructions

These instructions apply to `apps/a1-labs/`. Follow the repository's root
[AGENTS.md](../../AGENTS.md) first.

Read the canonical [Labs contribution and versioning guide](../../packages/react/ai/labs-contributing.md)
before changing this app. It defines how to add experiments, preserve shared
behavior, validate changes and keep documentation current.

For every experiment, follow the guide's
[CSS isolation and A1 promotion contract](../../packages/react/ai/labs-contributing.md#isolate-experiments-and-prepare-them-for-a1).

Every completed Labs change must include the appropriate version bump and
changelog entry in the same change. Keep the package version, root lockfile and
latest numbered changelog section synchronized. Review this entry point and the
linked guide whenever features change; update any affected instructions and the
README before declaring the work complete.

Keep detailed policies and project context in `packages/react/ai/`. Maintain this
file as the discoverable entry point and keep its links current.

For the automatic verification flow and its saved-state contract, read
[Verification journey](../../packages/react/ai/labs-verification-journey.md).

For long-form navigation and the shared date-of-birth studies:

[Form experiments](../../packages/react/ai/labs-form-experiments.md).

For Labs home search, sorting, experiment tags, gallery results and responsive header appearance controls:

[Home search and sorting](../../packages/react/ai/labs-home.md).

For the physical split-flap clock and its Three.js lifecycle:

[Flip clock](../../packages/react/ai/labs-flip-clock.md).

For the landing-page split-flap billboard and shared graphics mechanism:

[Flip billboard](../../packages/react/ai/labs-flip-billboard.md).

For opted-in focus treatments and motion fallbacks:

[Focus animations](../../packages/react/ai/labs-focus-animations.md).

For the Three.js switch experiment and its accessible fallbacks:

[Switch transition 3D](../../packages/react/ai/labs-switch-three.md).

[Button interactions](../../packages/react/ai/labs-button-motion.md).

For the eight step presentations and their shared progress-tab behavior:

[Steps](../../packages/react/ai/labs-steps.md).

For the noninteractive position indicator and its six treatments:

[Step tracker](../../packages/react/ai/labs-step-tracker.md).

For list placement and magnetic grid reordering, including snap, spring and undo contracts:

[Reordering](../../packages/react/ai/labs-reordering.md).

For message styles, submission motion and simulated replies:

[Chat](../../packages/react/ai/labs-chat.md).

[Automation builder](../../packages/react/ai/labs-automation-builder.md).

[Token styling and hierarchy](../../packages/react/ai/labs-token-studies.md).

For table pagination placement and scale configurations:

[Table pagination position](../../packages/react/ai/labs-data-tables.md).

For long-table page navigation variants and the shared render callback:

[Pagination types](../../packages/react/ai/labs-pagination-types.md).

For shared Labs datasets, size presets and the consolidation audit:

[Sample data](../../packages/react/ai/labs-sample-data.md).

For tab styling, current-tab feedback and neutral folder selection:

[Tabs](../../packages/react/ai/labs-tabs.md).

[Publishing Labs](../../packages/react/ai/labs-publishing.md) — separate Netlify project, build configuration, domain and release workflow.
