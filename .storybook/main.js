const config = {
  stories: ["../packages/react/src/**/*.stories.@(js|jsx)"],
  staticDirs: ["./public"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (config) => ({
    ...config,
    server: {
      ...config.server,
      allowedHosts: [
        ...(Array.isArray(config.server?.allowedHosts) ? config.server.allowedHosts : []),
        "localhost",
        "127.0.0.1",
      ],
    },
  }),
};

export default config;
