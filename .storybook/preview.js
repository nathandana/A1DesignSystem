import "../build/css/tokens.css";
import "../build/css/breakpoints.css";
import "./themes.css";
import "../packages/react/src/utilities/spacing.css";

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Design system theme",
    defaultValue: "a1Light",
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: "a1Light",      title: "A1 Light" },
        { value: "a1Accessible", title: "A1 Accessible" }
      ],
      showName: true,
      dynamicTitle: true
    }
  },
  colorScheme: {
    name: "Color scheme",
    description: "Light or dark mode",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", title: "Light", icon: "sun" },
        { value: "dark",  title: "Dark",  icon: "moon" }
      ],
      showName: true,
      dynamicTitle: true
    }
  }
};

const withTheme = (Story, context) => {
  const theme       = context.globals?.theme ?? "a1Light";
  const colorScheme = context.globals?.colorScheme ?? "light";
  document.documentElement.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
  document.documentElement.classList.toggle("a1-theme-dark", colorScheme === "dark");
  return Story();
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
            "Containers", ["Card", "Dialog", "Grid", "Page Layout"],
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
          ],
          "Utilities",
        ],
      },
    },
  }
};

export default preview;
