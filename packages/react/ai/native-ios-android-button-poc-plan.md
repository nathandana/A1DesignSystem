# Plan — Native iOS and Android Button proof of concept

## Objective

Add two genuine native packages to A1:

- `packages/ios` — SwiftUI package
- `packages/android` — Jetpack Compose library

Add a dedicated native showcase application:

- `apps/a1-ios` — the first-party iOS component catalog and configurator
- `apps/a1-android` — a future equivalent app built after the Android package contract is proven

Each package must contain a functional, token-driven Button — not placeholders or React Native wrappers — and enough tooling, documentation, rules, examples, and CI to prove that more components can follow safely.

The existing React Button remains the semantic reference, while each native implementation follows platform conventions. The showcase apps use the same serializable component configuration contract as the a1-web configurator so examples, saved configurations, and agent-generated component JSON do not drift by platform.

## Proof-of-concept scope

Implement Button with:

- Variants: primary, secondary, tertiary, destructive, and success
- Sizes: sm, md, and lg
- Leading or trailing native icon content
- Natural or full width
- Enabled, pressed, disabled, and loading states
- Base/default, accessible, and heritage themes
- Light and dark color schemes
- Dynamic Type on iOS and system font scaling on Android
- Native screen-reader and interaction semantics
- A dedicated iOS showcase app with one routed view per implemented native component
- A schema-driven Button configurator in the iOS app
- Live theme and light/dark mode switching in the iOS app
- Import and export of the same Button `ComponentNode` JSON used by a1-web

### Intentional native differences

| Web/React property | iOS | Android |
| --- | --- | --- |
| `onClick` | Action closure | `onClick` lambda |
| `as` / `href` | Not supported | Not supported |
| Material icon name | SwiftUI `Image` slot, normally SF Symbols | Composable icon slot, normally Material Icons |
| Hover | Platform behavior only | Platform behavior only |
| 28/40px visual sizes | Minimum 44pt touch region | Minimum 48dp touch region |

The showcase architecture must be capable of listing every native component as the libraries expand. Button is the only component view populated during this proof of concept; the app must not imply that unimplemented web components are already available natively.

Standalone UIKit controls, Android XML Views, additional native components, the Android showcase app implementation, and public package publishing are outside this proof of concept.

## Shared configurator contract

The web, iOS, and future Android configurators must not maintain separate handwritten option lists. Introduce a machine-readable component contract for Button and generate platform-specific descriptors from it.

### Canonical files

- Add `system/components/component.schema.json` to validate component configurator contracts.
- Add `system/components/button.yaml` as the canonical Button control metadata.
- Add `scripts/build-component-contracts.mjs` to validate and generate consumers.
- Generate a JavaScript descriptor consumed by `apps/a1-web`.
- Generate a Swift descriptor consumed by `apps/a1-ios`.
- Reserve Kotlin descriptor generation for `apps/a1-android`; generating the Kotlin model during this proof of concept is preferred so the contract is proven before the Android app is built.

The YAML contract must describe:

- Component type: `Button`
- Display name, category, and canonical component icon
- Props, control types, defaults, allowed values, and helper-text label keys
- Which props apply to React, React Native, iOS, and Android
- The content mapping from the configurator label to `content.fallback`
- Default omission rules used by `toJson`
- Native property names when they intentionally differ from the web prop name

The serialized output remains the existing a1-web `ComponentNode` shape:

```json
{
  "id": "button-1",
  "type": "Button",
  "props": {
    "variant": "secondary",
    "size": "lg",
    "icon": "check",
    "iconPosition": "end",
    "fullWidth": true,
    "loading": true,
    "disabled": true
  },
  "content": {
    "fallback": "Save changes"
  }
}
```

Each platform may translate that portable node into an idiomatic native API. For example, iOS resolves the portable `icon` intent to a caller-selected `Image`, while the saved JSON retains the shared A1 icon name. Unsupported props must be reported visibly and preserved during round trips rather than silently deleted.

## Repository constraint

At the time this plan was written, the working tree was on `feature/a1-2487-span-grids` with unrelated uncommitted work. Implementation should begin in a separate worktree based on `release`, for example:

```sh
git worktree add -b feature/native-button-poc ../A1-native-button-poc release
```

Do not stash, delete, or absorb changes from the existing working tree.

## Work packet 1 — Establish the native contract

**Size:** Small

**Dependencies:** None

**Recommended owner:** Lead or integrating agent

Create the architectural contract before delegating platform work.

### Files

- Add `packages/react/ai/native-platforms.md`.
- Update `AGENTS.md` with a link to the new guidance.
- Update `packages/react/ai/project-foundations.md`.
- Update `packages/react/ai/project-workflows.md`.
- Update `packages/react/ai/quick-orientation.md`.

### Requirements

Document:

- SwiftUI and Jetpack Compose as the first-class native frameworks.
- React defines semantic intent, not a literal platform implementation.
- Tokens remain the visual source of truth.
- Native controls, accessibility conventions, touch targets, typography scaling, RTL, and reduced-motion behavior take precedence over copying web mechanics.
- The Button API and supported proof-of-concept themes listed above.
- The one-view-per-component showcase application architecture.
- The shared YAML configurator contract and `ComponentNode` round-trip requirements.
- Generated files must never be edited manually.
- UIKit and Android View interoperability are future work.

### Acceptance criteria

- The contract leaves no platform or API choices for downstream agents to invent.
- Root `AGENTS.md` contains links only, following repository policy.

## Work packet 2 — Build the shared configurator contract

**Size:** Medium

**Dependencies:** Work packet 1

**Recommended owner:** Schema/tooling agent

Create the machine-readable Button definition used by the web and native showcase applications.

### Files

- Add `system/components/component.schema.json`.
- Add `system/components/button.yaml`.
- Add `scripts/build-component-contracts.mjs`.
- Generate `apps/a1-web/src/pages/components/generated/button.contract.js`.
- Generate `apps/a1-ios/A1Showcase/Generated/ButtonContract.swift`.
- Prefer also generating `apps/a1-android/app/src/main/kotlin/app/a1design/showcase/generated/ButtonContract.kt` so the future Android app cannot invent a different model.
- Add shared valid and invalid Button fixtures under `system/components/fixtures/`.
- Add root `build:component-contracts` and `check:component-contracts` scripts.

### Requirements

- Validate YAML against the schema before generating output.
- Preserve the current a1-web Button defaults and enum values.
- Generate typed control descriptors for text, enum/choice, Boolean, and icon controls.
- Generate portable `ComponentNode` encode/decode helpers or fixtures for each consumer.
- Keep user-facing helper text in `system/labels/`; the YAML stores label keys and fallbacks rather than untranslated copy.
- Reject duplicate properties, unsupported control types, invalid defaults, and enum defaults absent from their option list.
- Support a `--check` mode that fails on stale generated descriptors.
- Keep the first implementation Button-specific. Do not build a speculative universal form engine beyond the control types Button needs.

### Acceptance criteria

- The same fixture produces equivalent web, Swift, and Kotlin Button configuration values.
- Web-to-iOS-to-web round trips preserve unknown or temporarily unsupported props.
- An invalid Button variant is rejected consistently.
- Changing a Button option in YAML changes generated descriptors for every configured consumer.

### Verification

```sh
npm run build:component-contracts
npm run check:component-contracts
```

## Work packet 3 — Generate native Button tokens

**Size:** Medium

**Dependencies:** Work packet 1

**Recommended owner:** Node/tooling agent

Build one deterministic token pipeline for both packages.

### Files

- Add `scripts/build-native-tokens.mjs`.
- Update the root `package.json`.
- Refactor reusable resolution logic out of `system/build-themes.mjs` if needed.
- Continue using `system/tokens/component/button.json` without duplicating its values.
- Generate `packages/ios/Sources/A1DesignSystemIOS/Generated/A1ButtonTokens.swift`.
- Generate `packages/android/a1-design-system/src/main/kotlin/app/a1design/system/generated/A1ButtonTokens.kt`.

### Generated data

The generator must emit:

- All five variants
- Background, foreground, border, and pressed colors
- Disabled opacity
- Heights, padding, gaps, radii, icon sizes, and border widths
- Button typography
- Base/default, accessible, and heritage palettes
- Light and dark palettes

Add scripts equivalent to:

```json
{
  "build:native:tokens": "node scripts/build-native-tokens.mjs",
  "check:native:tokens": "node scripts/build-native-tokens.mjs --check"
}
```

### Requirements

- Generated Swift and Kotlin sources are committed.
- Generated sources contain resolved native values, never `{token.alias}` or CSS `var(...)` expressions.
- Component source contains no copied token literals.
- `--check` fails when generated output is stale.
- `npm run build:tokens` regenerates native output.

### Verification

```sh
npm run build:tokens
npm run check:native:tokens
git diff --exit-code -- packages/ios packages/android
```

The final command should be clean immediately after generation.

## Work packet 4 — Implement the iOS package

**Size:** Medium

**Dependencies:** Work packet 3

**Recommended owner:** SwiftUI agent

### Package structure

```text
packages/ios/
├── Package.swift
├── README.md
├── CHANGELOG.md
├── AGENTS.md
├── CLAUDE.md
├── ai/project-context.md
├── Sources/A1DesignSystemIOS/
│   ├── A1Button.swift
│   ├── A1ButtonStyle.swift
│   ├── A1Theme.swift
│   └── Generated/A1ButtonTokens.swift
└── Tests/A1DesignSystemIOSTests/
```

### Implementation

- Export product/module `A1DesignSystemIOS`.
- Build `A1Button` on SwiftUI's native `Button`.
- Use enums `A1ButtonVariant`, `A1ButtonSize`, and `A1ButtonIconPosition`.
- Provide text-only and native icon-content initializers.
- Use an environment-based `A1Theme`.
- Use `ProgressView` for loading.
- Preserve the visible label as the accessible name during loading.
- Respect `isEnabled`, color scheme, Dynamic Type, RTL, and Reduce Motion.
- Retain at least a 44×44pt interaction region, including visually smaller buttons.
- Include a SwiftUI preview gallery covering all variants, sizes, themes, icons, loading, and disabled states.

Do not:

- Build the control from gestures on a generic view.
- Introduce a UIKit-only implementation.
- Hardcode visual values in `A1Button.swift`.
- Translate Material icon strings to SF Symbols in this proof of concept.

### Verification

```sh
xcodebuild \
  -scheme A1DesignSystemIOS \
  -destination 'generic/platform=iOS Simulator' \
  build
```

Add unit tests for token and variant selection and a simulator test destination in CI. Manually verify VoiceOver, accessibility text sizes, dark mode, and RTL.

## Work packet 5 — Build the dedicated iOS showcase app

**Size:** Medium

**Dependencies:** Work packets 2 and 4

**Recommended owner:** SwiftUI application agent

Build a dedicated native iOS app at `apps/a1-ios`. Do not repurpose `apps/ios-example`; that existing app is an Expo/React Native example and must remain clearly separate.

### Application structure

```text
apps/a1-ios/
├── A1Showcase.xcodeproj/
├── A1Showcase/
│   ├── A1ShowcaseApp.swift
│   ├── Navigation/
│   │   ├── ComponentCatalogView.swift
│   │   └── ComponentRoute.swift
│   ├── Components/
│   │   └── ButtonShowcaseView.swift
│   ├── Configurator/
│   │   ├── ComponentConfiguratorView.swift
│   │   ├── ConfiguratorControlView.swift
│   │   └── ComponentNodeDocument.swift
│   ├── Theme/
│   │   └── ThemeSettingsView.swift
│   └── Generated/
│       └── ButtonContract.swift
├── A1ShowcaseTests/
├── A1ShowcaseUITests/
├── README.md
├── CHANGELOG.md
├── AGENTS.md
└── ai/project-context.md
```

### App behavior

- Use a `NavigationStack` with a catalog list as the root view.
- Show one catalog row and one routed showcase view for every component currently exported by `packages/ios`.
- During the proof of concept, the catalog contains Button only.
- Give each component its own `ButtonShowcaseView`; do not put all components into one growing screen.
- Present a live component preview followed by its configurator controls.
- Build configurator controls from the generated YAML descriptor rather than handwritten Button option arrays.
- Update the preview immediately as configuration changes.
- Provide a JSON view that reads and writes the same Button `ComponentNode` used by a1-web.
- Provide copy, paste/import, reset-to-default, and visible validation-error behavior for the JSON.
- Preserve unsupported properties during an import/export round trip.
- Use the iOS package through a local Swift Package dependency; do not duplicate `A1Button` inside the app.

### Theme switching

- Add an app-level theme menu or settings view.
- Support base/default, accessible, and heritage.
- Support system, light, and dark color-scheme selection.
- Persist theme and color-scheme choices with `@AppStorage`.
- Apply theme changes live to the entire showcase and every component preview.
- Keep component configuration state when the theme changes.
- Ensure theme controls have labels, selected-state semantics, and keyboard/Switch Control support.

### Scalability requirements

- Component navigation is driven by a typed registry, not a hardcoded switch spread across views.
- Adding a future component requires one route registration and one component showcase view.
- The empty state is defined for a build with no registered native components, even though Button exists in this proof of concept.
- Unimplemented React components must not appear as interactive catalog destinations.
- The architecture must allow search and favorites later, but neither is part of this proof of concept.

### Verification

- Launch the app in at least one small and one large iPhone simulator.
- Navigate catalog → Button → back using standard iOS navigation.
- Exercise every Button control and confirm the preview and JSON remain synchronized.
- Export a configuration from a1-web, import it into the iOS app, re-export it, and compare normalized JSON.
- Switch every supported theme and color scheme without resetting the Button configuration.
- Verify VoiceOver traversal, Dynamic Type, RTL, Reduce Motion, and landscape layout.
- Add UI tests for routing, configuration changes, JSON validation, reset, and theme persistence.

## Work packet 6 — Implement the Android package

**Size:** Medium

**Dependencies:** Work packet 3

**Recommended owner:** Kotlin/Compose agent

### Package structure

```text
packages/android/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle/libs.versions.toml
├── gradlew
├── gradle/wrapper/
├── README.md
├── CHANGELOG.md
├── AGENTS.md
├── CLAUDE.md
├── ai/project-context.md
└── a1-design-system/
    ├── build.gradle.kts
    └── src/
        ├── main/kotlin/app/a1design/system/
        ├── test/
        └── androidTest/
```

### Implementation

- Create an Android library using Jetpack Compose and Material 3 primitives.
- Use namespace `app.a1design.system`.
- Export `A1Button`.
- Add `A1ButtonVariant`, `A1ButtonSize`, and `A1ButtonIconPosition`.
- Accept caller-provided composable icon content.
- Provide `A1Theme` and CompositionLocal-backed token access.
- Use Material indication and ripple behavior.
- Use `CircularProgressIndicator` for loading.
- Preserve label, role, enabled state, and indeterminate progress semantics.
- Retain the Android 48dp minimum touch target.
- Use `sp`, font scaling, RTL-aware placement, and platform focus behavior.
- Add Compose previews for the complete proof-of-concept matrix.

### Verification

```sh
packages/android/gradlew \
  -p packages/android \
  :a1-design-system:assembleDebug \
  :a1-design-system:lintDebug \
  :a1-design-system:testDebugUnitTest
```

Add Compose UI tests for click behavior, disabled/loading behavior, label semantics, icons, and full-width layout.

The development machine had Swift and Xcode installed when this plan was written, but no Java runtime, Gradle, Android SDK, or `adb`. Android verification therefore needs either a bootstrapped local environment or CI.

## Work packet 7 — Update rules and agent guidance

**Size:** Small

**Dependencies:** Work packets 4–6

**Recommended owner:** Documentation/governance agent

### Rules

Update `system/rules/button.yaml`:

- Clarify that the minimum target is 44pt on iOS and 48dp on Android.
- Add a rule requiring native Button primitives and semantics.
- Add a Dynamic Type and font-scale rule.
- Add a loading-state rule covering disabled activation and progress semantics.
- Add a native-feedback rule: use standard iOS pressed behavior and Android indication rather than copied web hover animations.
- Keep the component name `Button`; do not create separate `A1Button` rule identities.

### Guidance

Update:

- Package-specific `AGENTS.md`, `CLAUDE.md`, and `ai/project-context.md` files
- `apps/a1-ios/AGENTS.md` and `apps/a1-ios/ai/project-context.md`
- `packages/react/ai/components-maintenance.md`
- `system/icons/icon-usage.md`

Guidance must include:

- Copy-paste SwiftUI and Compose usage
- Token-generation commands
- Component-contract generation and round-trip requirements
- The one-view-per-component showcase pattern
- Verification commands
- Supported and deferred behavior
- A warning never to hand-edit generated token files

## Work packet 8 — Make native coverage discoverable

**Size:** Medium

**Dependencies:** Work packets 4–6

**Recommended owner:** Web/documentation agent

### Component registry

Update `packages/react/ai/components.md`:

- Rename the existing `Native` column to `React Native`.
- Add `iOS` and `Android` columns.
- Mark only Button as implemented for the two new columns.
- Leave every other component unavailable so the proof of concept is represented honestly.

### MCP index

Update:

- `packages/mcp-server/scripts/lib/parse-components.mjs`
- `packages/mcp-server/scripts/build-index.mjs`
- `packages/mcp-server/netlify/functions/mcp.mjs`
- `packages/mcp-server/README.md`
- `packages/mcp-server/CHANGELOG.md`
- Regenerate `packages/mcp-server/index.json`.

Preserve the existing `native` field as a React Native compatibility alias. Add `reactNative`, `ios`, and `android` fields and allow the new package filters.

### A1-web

Update `apps/a1-web/src/pages/components/detail/button.jsx`:

- Replace handwritten Button defaults and option arrays with the generated Button contract from work packet 2.
- Keep `toJson` and `fromJson` compatible with existing saved Button nodes.
- Add separate React Native, iOS, and Android snippet modes.
- Keep the browser preview representative; do not imply it executes native code.
- Add any new visible labels to `system/labels/app.json` with all required translations.
- Update `apps/a1-web/CHANGELOG.md`.

Add iOS and Android proof-of-concept installation guidance to `apps/a1-web/src/pages/GetStarted.jsx`, explicitly stating that Button is the only implemented component.

### Verification

```sh
npm run build:mcp-index
npm run build:a1-web:test
npm run lint
```

## Work packet 9 — Add native CI and repository hygiene

**Size:** Small

**Dependencies:** Work packets 2–8

**Recommended owner:** Build/CI agent

Add `.github/workflows/native.yml` with path-filtered jobs:

1. Token and component-contract drift checks on Ubuntu and Node.
2. Swift package build and tests on macOS.
3. Native iOS showcase app build and UI tests on macOS.
4. Android assemble, lint, and tests on Ubuntu with a pinned JDK and Gradle cache.

Update `.gitignore` narrowly:

```gitignore
packages/ios/.build/
packages/ios/.swiftpm/
apps/a1-ios/DerivedData/
apps/a1-ios/**/*.xcuserstate
packages/android/.gradle/
packages/android/**/build/
packages/android/local.properties
```

Do not ignore the repository's root `build/` directory; it contains tracked token output.

Do not add the packages to the npm publishing loop. Production Swift Package Manager and Maven distribution are post-proof-of-concept decisions.

## Work packet 10 — Build the future Android showcase app

**Status:** Post-proof-of-concept follow-up

**Size:** Medium

**Dependencies:** Successful completion of work packets 2, 6, and 9

**Recommended owner:** Kotlin/Compose application agent

Create `apps/a1-android` as the Android counterpart to `apps/a1-ios`.

It must:

- Consume `packages/android` as a Gradle project dependency.
- Use a typed component registry with one navigation destination per implemented Android component.
- Initially expose Button, then grow automatically with Android package coverage.
- Render controls from the Kotlin descriptor generated from `system/components/button.yaml`.
- Read, edit, validate, and export the same Button `ComponentNode` JSON used by a1-web and iOS.
- Support base/default, accessible, and heritage themes plus system, light, and dark color schemes.
- Persist theme choices with DataStore.
- Use Navigation Compose, Material 3 controls, TalkBack semantics, font scaling, RTL, and standard Android back navigation.
- Match the iOS app's information architecture and portable configuration behavior without copying iOS-specific visual or navigation conventions.

The Android app is not required to accept the Button package proof of concept. Its generated contract and proposed file location must exist so its implementation is a bounded follow-up rather than a new architecture exercise.

## Merge order

1. Native architecture contract
2. Shared configurator contract
3. Native token generator
4. iOS and Android package branches in parallel
5. Dedicated iOS showcase app
6. Rules and agent documentation
7. Coverage, MCP, and a1-web discoverability
8. CI and final verification
9. Android showcase app as the first post-proof-of-concept follow-up

Each execution agent should own only its listed paths and report:

- Files changed
- Commands run and results
- Manual checks completed
- Any hardcoded values or platform deviations
- Unresolved risks

## Final verification matrix

Verify every combination that materially changes behavior or presentation:

| Area | Required coverage |
| --- | --- |
| Variants | Primary, secondary, tertiary, destructive, success |
| Sizes | Sm, md, lg |
| State | Default, pressed, disabled, loading |
| Layout | Natural width, full width, long wrapping label |
| Icon | None, leading, trailing |
| Theme | Base/default, accessible, heritage |
| Scheme | Light, dark |
| Text | Default size, largest supported accessibility size |
| Direction | LTR, RTL |
| Accessibility | VoiceOver or TalkBack, keyboard/switch focus, touch target |
| iOS app navigation | Catalog, Button view, native back navigation, state restoration |
| Configurator | Form controls, live preview, JSON edit/import/export, reset, validation |
| Contract parity | Identical normalized `ComponentNode` across web and iOS; Kotlin fixture parity |
| Theme switching | Theme and scheme change live without losing component configuration |

## Proof-of-concept exit criteria

The proof of concept succeeds when:

- Both packages contain real, importable native Button code.
- Neither package depends on React Native.
- A token change regenerates both Swift and Kotlin output.
- No native component source duplicates design values.
- All variants, sizes, themes, modes, icons, loading, disabled, and full-width states work.
- VoiceOver, TalkBack, text scaling, RTL, touch targets, and reduced motion are verified.
- The dedicated iOS app lists every currently implemented iOS component, with Button as the initial entry.
- Button has its own iOS showcase view and schema-driven configurator.
- a1-web and iOS can exchange Button `ComponentNode` JSON without losing supported or unknown properties.
- Theme and color-scheme switching applies live and persists between iOS app launches.
- The same YAML contract generates web, Swift, and Kotlin configurator descriptors.
- CI catches stale generated files and native build failures.
- The registry and MCP accurately show Button-only native coverage.
- An agent with no prior context can implement the next component using the new package guidance.

## Post-proof-of-concept decisions

After the proof of concept passes, decide:

- How to distribute the Swift package from a monorepo: separate repository, Swift Package Registry, or XCFramework release.
- Which Maven-compatible registry should publish the Android artifact.
- Whether UIKit and Android View adapters are required.
- Whether the native icon strategy needs a shared semantic-name mapping.
- Which second component best validates the architecture.
- When to implement `apps/a1-android` using the already-generated Kotlin configurator contract.
