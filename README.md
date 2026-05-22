# A1DesignSystem
An AI First multifunctional design system proof of concept.

## Local npm setup

This repo has a local Node.js install under `.tools/`. To use npm in this shell:

```sh
export PATH="$PWD/.tools/node/bin:$PATH"
npm --version
```

From scratch design system that leverages AI to help create it, but more importantly is setup to be consumed by AI agents to create consistent outputs.

Features:
Multi Brand - theming, language, density and more
Token and rules driven

Tech Stack
* Storybook
* Style dictionary
* Figma
* Markdown, Yaml

Output
* Design documentation (self documenting)
* AI Output examples from various agents, fully compatible
* Figma library
* Custom theme builder/explorer
* Pattern Library
* Accessibility mode (enhanced)
* Dark mode/Inverse section
* Automated A11y colors
* Personal Portfolio

Features
* Technically excellent
* Accessible
* Ahead of the curve
* Color scale (define one central color, the rest are automatically defined)
* Type scale

Themable
* Colors
* Radius
* Shadows
* Typography
* Scale
* Density
* Language


Package structure:
* /system = source of truth for AI and humans
* /packages = code people install
* /storybook = visual reference
* /examples = proof of use
