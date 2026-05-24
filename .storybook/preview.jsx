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
        { value: "a1Light",      title: "A1 Light" },
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
        { value: "light", title: "Light", icon: "sun" },
        { value: "dark",  title: "Dark",  icon: "moon" },
      ],
      dynamicTitle: true,
    },
  },
};

const withTheme = (Story) => {
  const [globals] = useGlobals();

  const theme       = globals?.theme       ?? "a1Light";
  const colorScheme = globals?.colorScheme ?? "light";

  useEffect(() => {
    document.documentElement.classList.toggle("a1-theme-heritage", theme === "a1Heritage");
    document.documentElement.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
    document.documentElement.classList.toggle("a1-theme-dark", colorScheme === "dark");

    return () => {
      document.documentElement.classList.remove(
        "a1-theme-heritage",
        "a1-theme-accessible",
        "a1-theme-dark",
      );
    };
  }, [theme, colorScheme]);

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
          ],
          "Foundations", [
            "Breakpoints", "Colors", "Icon",
            "Tokens", [
              "Base Breakpoints", "Base Colors", "Base Spacing", "Base Radius",
              "Semantic Colors", "Semantic Shadow", "Semantic Typography",
              "Notification", "Button", "Card", "Dialog", "Icon Button",
              "Link", "Message", "Page Layout", "Pagination", "Segmented Control", "Tab", "Typography",
            ],
            "Typography",
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
