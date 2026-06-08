const config = {
  stories: ["../packages/react/src/**/*.stories.@(js|jsx)"],
  staticDirs: ["./public"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  }
};

export default config;
