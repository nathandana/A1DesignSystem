## React Native Package

This package implements the A1 design system for iOS and Android using React Native. It mirrors the React web component library in visual design and component API, adapted for native platform constraints.

### Token consumption

Generated token files live in `src/tokens/`:

| File | Contents |
|------|----------|
| `generatedThemeColors.ts` / `.js` | Color tokens per theme |
| `typography.ts` / `.js` | Font family, size, weight, line-height |
| `spacing.ts` / `.js` | Spacing scale |

These files are **generated** by `system/build-themes.mjs`. Do not edit them directly. Add or change token values in `system/tokens/` and run `npm run build:themes`.

### Platform rules

- Do not hardcode colors, spacing, or font sizes. Always consume the generated token values.
- Prefer `StyleSheet.create` over inline styles for performance.
- Follow iOS Human Interface Guidelines and Android Material Design guidelines where they align with A1 — resolve conflicts in favour of A1.
- All interactive elements must meet 44×44pt minimum touch target size.
- Test on both iOS and Android before considering a component complete.
