import "../build/css/tokens.css";
import "../build/css/breakpoints.css";
import "./themes.css";
import "../packages/react/src/utilities/spacing.css";

import { useEffect } from "react";
import { useGlobals } from "storybook/preview-api";

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
      icon: "accessibility",
      items: [
        { value: "system", title: "Motion: System", icon: "browser" },
        { value: "reduce", title: "Motion: Reduced", icon: "accessibility" },
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

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("a1-theme-heritage",  theme === "a1Heritage");
    html.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
    // Explicit light/dark: set the matching class and clear the other.
    // "system" clears both so the prefers-color-scheme media query takes over.
    html.classList.toggle("a1-theme-dark",  colorScheme === "dark");
    html.classList.toggle("a1-theme-light", colorScheme === "light");
    // Reduced motion: set explicit class to mirror prefers-reduced-motion.
    html.classList.toggle("a1-reduce-motion", reducedMotion === "reduce");

    return () => {
      html.classList.remove(
        "a1-theme-heritage",
        "a1-theme-accessible",
        "a1-theme-dark",
        "a1-theme-light",
        "a1-reduce-motion",
      );
    };
  }, [theme, colorScheme, reducedMotion]);

  return <Story />;
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
            "Typography", ["Heading", "Paragraph", "List", "Inline"],
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
