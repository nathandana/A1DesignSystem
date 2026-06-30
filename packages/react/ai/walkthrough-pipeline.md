# Video walkthrough pipeline

This is the first vertical slice for A1-107: prompt-to-MP4 walkthroughs.

The goal is to make a walkthrough reproducible before adding expensive or provider-specific pieces. A YAML spec drives Playwright capture, which writes screenshots, browser video, event timings, narration timing estimates, and a Remotion-ready input manifest. TTS audio and final MP4 rendering are follow-up adapters that consume the same artifacts.

## Files

- `walkthroughs/*.walkthrough.yaml` — authored walkthrough specs.
- `scripts/walkthrough/capture.mjs` — runs the walkthrough in Playwright and writes artifacts.
- `scripts/walkthrough/narration.mjs` — creates narration scripts, word timing estimates, and captions.
- `scripts/walkthrough/prompt-to-spec.mjs` — turns a prompt into a starter YAML spec.
- `scripts/walkthrough/render.mjs` — renders a captured artifact folder to MP4 with Remotion.
- `scripts/walkthrough/demo.mjs` — runs capture, narration, and Remotion render for the sample walkthrough.
- `walkthroughs/artifacts/` — generated capture output, ignored by git.
- `walkthroughs/narration/` — generated narration output, ignored by git.

## Commands

```sh
npm run walkthrough:prompt -- "Show how to search for the Button component"
npm run walkthrough:capture -- walkthroughs/a1-global-search.walkthrough.yaml
npm run walkthrough:narration -- walkthroughs/a1-global-search.walkthrough.yaml
npm run walkthrough:narration -- walkthroughs/artifacts/demo-global-search/<timestamp>/walkthrough.json --out-dir walkthroughs/artifacts/demo-global-search/<timestamp>/narration --voiceover
npm run walkthrough:render -- walkthroughs/artifacts/demo-global-search/<timestamp>
npm run walkthrough:render -- walkthroughs/artifacts/demo-global-search/<timestamp> --captions
npm run walkthrough:demo -- --base-url http://127.0.0.1:5177
```

The capture command expects a running a1-web server. Use:

```sh
npm run dev:a1-web
```

To target a different server:

```sh
npm run walkthrough:capture -- walkthroughs/a1-global-search.walkthrough.yaml --base-url http://127.0.0.1:5188
```

## Spec shape

```yaml
id: a1-global-search
title: Search for a component
baseUrl: http://127.0.0.1:5177
viewport:
  width: 1280
  height: 720
recordVideo: true
steps:
  - id: open-home
    title: Open A1
    narration: Start on the A1 home page.
    goto: /
    waitForText: A1

  - id: search-button
    title: Search for Button
    narration: Type Button and open the selected result.
    actions:
      - press: /
      - fill:
          selector: .a1-global-search__input input
          value: Button
      - press: Enter
```

Each step can use either a single action shorthand (`goto`, `click`, `fill`, `press`, `hover`, `waitForText`, `waitForSelector`, `wait`) or an `actions` array. Prefer stable roles, labels, text, and component classes over brittle positional selectors.

## Outputs

Each capture run creates a timestamped folder containing:

- `walkthrough.json` — complete run manifest.
- `timings.json` — compact event timing data.
- `remotion-input.json` — composition size, assets, and timeline cues.
- `screenshots/*.png` — one screenshot per captured step.
- `video/*.webm` — Playwright browser capture when `recordVideo` is enabled.
- `*.mp4` — final rendered walkthrough after `npm run walkthrough:render`.
- `render.json` — Remotion render metadata.

Each narration run creates:

- `*.narration.json` — step narration with estimated word timings.
- `*.captions.srt` — caption file.
- `*.script.md` — human-editable narration script.
- `NN-step-id.m4a` — per-step local voiceover when `--voiceover` is used on macOS.

## Remotion render

`walkthrough:render` uses the artifact folder itself as Remotion's public asset directory. The composition reads `remotion-input.json` plus any generated `narration/*.narration.json`. When narration exists, the final walkthrough is paced from the measured per-step audio durations, uses the per-step screenshots as the visual timeline, plays each step's voiceover inside its own sequence, and renders an MP4 next to the manifest. Captions are hidden by default; pass `--captions` to show them. The raw Playwright `.webm` remains in the artifact folder as source capture evidence.

```sh
npm run walkthrough:render -- walkthroughs/artifacts/demo-global-search/2026-06-29T22-21-10-054Z
```

If no folder is provided, the renderer finds the most recent artifact folder under `walkthroughs/artifacts/`.

## Follow-up adapters

The stable handoff is `walkthrough.json` plus `remotion-input.json`. Future slices should add:

1. A cloud/local TTS adapter that replaces estimated timings with provider word or character timestamps and richer voice choices.
2. Cursor/click highlight extraction from Playwright events.
3. Optional AI spec generation that writes the same YAML shape from a product prompt.
