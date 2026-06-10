import "../build/css/tokens.css";
import "../build/css/breakpoints.css";
import "./themes.css";
import "../packages/react/src/utilities/spacing.css";

import { useEffect } from "react";
import { useGlobals } from "storybook/preview-api";
import { LabelsProvider } from "../packages/react/src/components/labels/Labels.jsx";
import actionJson    from "../system/labels/action.json";
import calendarJson  from "../system/labels/calendar.json";
import codeJson      from "../system/labels/code.json";
import fieldJson     from "../system/labels/field.json";
import statusBarJson from "../system/labels/status-bar.json";

const allLabels = {
  label: {
    ...actionJson.label,
    ...calendarJson.label,
    ...codeJson.label,
    ...fieldJson.label,
    ...statusBarJson.label,
  },
};

const RTL_LOCALES = new Set(["ar"]);

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Design system theme",
    defaultValue: "a1Light",
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: "a1Light",      title: "Base" },
        { value: "a1Heritage",   title: "A1 Heritage" },
        { value: "a1Accessible", title: "A1 Accessible" },
        { value: "a1Fresh",      title: "Fresh" },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
  colorScheme: {
    name: "Color scheme",
    description: "Light or dark mode",
    defaultValue: "light",
    toolbar: {
      icon: "sun",
      items: [
        { value: "light",  title: "Light",  icon: "sun" },
        { value: "dark",   title: "Dark",   icon: "moon" },
        { value: "system", title: "System", icon: "browser" },
      ],
      dynamicTitle: true,
    },
  },
  reducedMotion: {
    name: "Reduced motion",
    description: "Simulate prefers-reduced-motion: reduce",
    defaultValue: "system",
    toolbar: {
      icon: "lightning",
      items: [
        { value: "system", title: "System",  icon: "browser" },
        { value: "reduce", title: "Reduced", icon: "lightningOff" },
      ],
      dynamicTitle: true,
    },
  },
  contrastMode: {
    name: "Contrast",
    description: "Simulate prefers-contrast: more",
    defaultValue: "system",
    toolbar: {
      icon: "eye",
      items: [
        { value: "system", title: "System", icon: "browser" },
        { value: "more",   title: "More",   icon: "contrast" },
      ],
      dynamicTitle: true,
    },
  },
  locale: {
    name: "Locale",
    description: "UI string locale for translated component labels",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "EN", icon: "globe" },
        { value: "es", title: "ES", icon: "globe" },
        { value: "fr", title: "FR", icon: "globe" },
        { value: "de", title: "DE", icon: "globe" },
        { value: "pt", title: "PT", icon: "globe" },
        { value: "ja", title: "JA", icon: "globe" },
        { value: "zh", title: "ZH", icon: "globe" },
        { value: "ar", title: "AR", icon: "globe" },
      ],
      dynamicTitle: true,
    },
  },
};

const withTheme = (Story) => {
  const [globals] = useGlobals();

  const theme         = globals?.theme         ?? "a1Light";
  const colorScheme   = globals?.colorScheme   ?? "light";
  const reducedMotion = globals?.reducedMotion ?? "system";
  const contrastMode  = globals?.contrastMode  ?? "system";
  const locale        = globals?.locale        ?? "en";

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("a1-theme-heritage",  theme === "a1Heritage");
    html.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
    html.classList.toggle("a1-theme-fresh",      theme === "a1Fresh");
    // Explicit light/dark: set the matching class and clear the other.
    // "system" clears both so the prefers-color-scheme media query takes over.
    html.classList.toggle("a1-theme-dark",  colorScheme === "dark");
    html.classList.toggle("a1-theme-light", colorScheme === "light");
    // Reduced motion: set explicit class to mirror prefers-reduced-motion.
    html.classList.toggle("a1-reduce-motion", reducedMotion === "reduce");
    // Contrast: set explicit class to mirror prefers-contrast: more.
    html.classList.toggle("a1-contrast-more", contrastMode === "more");

    return () => {
      html.classList.remove(
        "a1-theme-heritage",
        "a1-theme-accessible",
        "a1-theme-fresh",
        "a1-theme-dark",
        "a1-theme-light",
        "a1-reduce-motion",
        "a1-contrast-more",
      );
    };
  }, [theme, colorScheme, reducedMotion, contrastMode]);

  // dir is scoped to the story canvas — not applied to document.documentElement
  // so the Storybook shell (toolbar, sidebar, controls) is unaffected.
  const dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  return (
    <div dir={dir}>
      <LabelsProvider locale={locale === "en" ? null : locale} labels={allLabels}>
        <Story />
      </LabelsProvider>
    </div>
  );
};

export const decorators = [withTheme];

const preview = {
  parameters: {
    backgrounds: { disable: true },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Components", [
            "Controls",   ["Button", "Icon Button", "Link", "Pagination", "Segmented Control", "Tabs"],
            "Containers", ["Card", "Dialog", "Grid", "Inverse", "Page Layout"],
            "Messaging",  ["Banner", "Empty State", "Notification"],
            "Typography", ["Heading", "Paragraph", "List", "Inline", "Code"],
          ],
          "Foundations", [
            "Breakpoints", "Colors", "Icon",
            "Tokens", [
              "Base Breakpoints", "Base Colors", "Base Spacing", "Base Radius",
              "Semantic Colors", "Semantic Shadow", "Semantic Typography",
              "Notification", "Button", "Card", "Dialog", "Icon Button",
              "Link", "Message", "Page Layout", "Pagination", "Segmented Control", "Tab", "Typography",
            ],
            "Motion",
            "Themes",
          ],
          "Rules",
          "Utilities",
        ],
      },
    },
  }
};

export default preview;
