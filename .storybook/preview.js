import "../build/css/tokens.css";
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
  }
};

const withTheme = (Story, context) => {
  const theme = context.globals?.theme ?? "a1Light";
  document.documentElement.classList.toggle("a1-theme-accessible", theme === "a1Accessible");
  return Story();
};

export const decorators = [withTheme];

const preview = {
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    layout: "centered"
  }
};

export default preview;
