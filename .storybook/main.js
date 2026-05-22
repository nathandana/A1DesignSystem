const config = {
  stories: ["../packages/react/src/**/*.stories.@(js|jsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  }
};

export default config;
