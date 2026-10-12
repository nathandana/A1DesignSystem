# Verification journey

Labs route: `/experiments/verification-journey`, category `interaction`.
Introduced in Labs 0.27.0. A candidate A1 application-verification pattern,
not a connected service or production workflow engine.

## Files and ownership

- `apps/a1-labs/src/verification-journey/VerificationProgress.jsx`: controlled
  progress, error and receipt composition. React and A1 only; no Labs imports,
  timers, network calls or CSS. Receives `job`, `persisted`, `headingRef`,
  `onRetry`, `onEdit` and `onNew`. The host owns effects and focuses stage headings.
- `demo-model.js`: the fictional 19-field workspace application, 6 service
  definitions, scenario timings, abortable waits, checkpoint reader and runner.
- `VerificationJourneyExperiment.jsx`: controlled form, native required/format
  validation, session storage, downloads, simulation lifecycle, configuration
  and shared responsive device preview. Tablet is the default; the device toolbar
  includes Phone, Landscape phone, Tablet, Laptop and Desktop.

`job` includes a stable reference, submitted values, scenario, phase, steps,
activity events, saved/completed timestamps and elapsed processing time.
Each step has `id`, `name`, `api`, `status`, `attempt`, `detail` and an append-only
`updates` array. Old checkpoints without `updates` still render their retained
detail and seed the history when processing continues.
Phases are running/error/success; restored running jobs become interrupted and
restart automatically. Step states: pending/running/retrying/done/error.
The overall progress counts done steps out of 6, never guessed elapsed progress.

## Flow

1. Review the prefilled application. StickyActions + ButtonContainer keeps the
   submit button fixed inside the preview, with its automatic content spacer.
2. Submission records a snapshot in session storage and automatically calls the
   simulated Validation, Contact, Address, Organization, Capacity and Workspace
   APIs sequentially. The submitted values cannot change mid-run. Show an A1
   indeterminate StatusBar for the active check and retry backoff; use
   completed icons and text for success. No pause or manual continue control.
   Reveal only started services. Append per-service updates/results without
   replacing earlier details. Keep the API/name and the indicator footprint
   fixed through state changes; the overall summary must not resize with each
   request's status message. Keep the live announcement screen-reader-only,
   with its corresponding details visible in the service history. Completed
   cards stay in place while verification is running or blocked; pending cards
   are not rendered.
3. On overall success, remove the individual service cards, including when a
   completed session is restored. Retain the summary, receipt and activity log;
   keep all check results in the saved job and download.
   Receipt names the exact workspace, organization, seat count, hosting region,
   owner, first project, reference and completion time. It explicitly states that
   no real workspace/account/reservation or email/invitation was created/sent.

Five deterministic scenarios: steady (~11 s), fast (~3 s), slow (~34 s with an
explicit still-waiting update per service), automatic recovery (Organization API
fails once), unavailable (Organization API fails all 3 attempts). Retry backoff
is 2 seconds, with a named service, cause and next attempt. Simulation timing is
service data, not visual motion or a promise about actual APIs.

After the final failure, stop dependent work. Explain the retained 19 fields and
3 completed checks, the 3 remaining services, that no workspace was created and
what to do next. Retry remaining checks simulates recovery; it preserves the
reference and successful checks. Edit application preserves values but starts a
fresh verification on resubmit. Reset experiment is a Labs-only configuration
action that cancels timers and discards the demo checkpoint.

## Retention and production limits

Session key: `a1-labs-verification-journey-v1`. The same tab restores submitted
values, completed checks and receipts across reloads; interrupted runs continue
automatically. A stored completed receipt does not resubmit. Closing the browser
session can discard data. Storage failures show memory-only retention and offer
a JSON download; never claim a server save. Edits before submission are not saved.
Reset removes the checkpoint. Abort prevents stale callbacks after navigation,
reset or replacement. Retrying an unfinished check is safe in this simulation.

A production adapter must supply actual validation/results, durable server
checkpoints, authenticated ownership, request cancellation/timeouts and
idempotency for side effects. This demo does not prove those guarantees. Its
receipt and service names are fictional. Do not connect it to actual services
without separately defining those contracts.

## Accessibility and styling

Native labeled required fields, correct types/ranges and meaningful fieldset
legends provide the input semantics. One polite atomic status announces service
changes, waits, retry causes and outcomes; do not announce frame-by-frame ticks.
Each progress indicator has a service-specific accessible name. The overall
progressbar announces completed checks rather than implying elapsed percentage.
Focus moves to the stage heading on submission/error/completion, never each
service update. A1's reduced-motion CSS freezes the service indicators while
text status and progress continue. Errors and success have textual descriptions
in addition to color/icon treatments.

All summary, service, recovery and receipt icons use Card’s `icon` and
`iconDisplay="default"` props. Use linear StatusBar indicators below the service names and overall count,
with `showPauseControl={false}` to keep the flow automatic. Unknown service
progress is indeterminate; a completed service has value 1/max 1. Do not
reintroduce circular progress or simulate within-request percentages.

No custom CSS or new visual tokens. Layout, fields, status cards, progress and
StickyActions use A1 props and live theme tokens. The shared preview fits width
and height and keeps fixed controls inside its iframe. The Labs configuration
sheet stays outside. Keep CSS isolated if this experiment later needs styles;
no shared class overrides or dependencies on another experiment are allowed.

## Validation

Model tests cover sequential completion, bounded retries, retained progress,
dependent-check blocking, recovery, slow updates, abort and invalid checkpoints.
Browser checks cover automatic retries, error recovery, checkpoint reload,
edited-value receipts, progress indicators, focus, mobile and reduced motion.
Focused axe checks passed for the form and processing UI on desktop and mobile.
Storage-denial messaging, whitespace validation, receipt download and preserved
completion across device/mode changes also passed. The 67 Labs unit tests and
both Labs and A1 Web production builds pass. Check the current recorded
results when changing the implementation; screen-reader speech still needs
manual assistive-technology review before promotion.

Shared viewport checks cover all 10 current device-preview experiments at desktop
and phone host widths, with height-constrained hosts. Resizing must preserve the
iframe's actual device dimensions and form/job state. `--verification-only` in
`capture-previews.mjs` captures the automatic retry state using the actual UI.

### Progressive disclosure refinement

The progressive-details update has model coverage for immutable prior updates
and completed services, plus desktop/mobile browser measurements proving the
summary/card heading positions and indicator footprint remain unchanged during
normal progress, retry and slow-service updates. Reduced-motion and final receipt
checks pass. Uses existing A1 layout/progress components; no custom CSS.

### Linear progress refinement

Summary and service cards use the shared StatusBar. The default A1 animation
pause control remains available to other consumers; Labs explicitly opts out.
Validated default pause behavior, opt-out/toggling, cleared paused state and
live reduced motion in an isolated A1 host. Desktop/mobile progressive-details
checks confirm stable geometry and no pause button during slow verification.
No custom CSS or visual tokens were needed.
