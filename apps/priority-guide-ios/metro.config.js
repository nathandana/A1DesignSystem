const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const appNodeModules = path.join(projectRoot, 'node_modules');
const workspaceNodeModules = path.join(workspaceRoot, 'node_modules');
const babelRuntimeRoot = path.join(workspaceNodeModules, '@babel/runtime');
const sharedGuideRoot = path.join(workspaceRoot, 'examples/priority-guide/guides');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  path.join(workspaceRoot, 'packages/react-native'),
  sharedGuideRoot,
  workspaceNodeModules,
];

config.resolver.nodeModulesPaths = [
  appNodeModules,
  workspaceNodeModules,
];

config.resolver.extraNodeModules = {
  '@priority-guide/guides': sharedGuideRoot,
  '@gtivr4/a1-design-system-react-native': path.join(workspaceRoot, 'packages/react-native'),
};

const localPackages = [
  'expo',
  'expo-asset',
  'expo-constants',
  'expo-file-system',
  'expo-font',
  'expo-haptics',
  'expo-keep-awake',
  'expo-status-bar',
  'react',
  'react-native',
  'react-native-safe-area-context',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@priority-guide/guides/')) {
    return {
      type: 'sourceFile',
      filePath: path.join(sharedGuideRoot, moduleName.slice('@priority-guide/guides/'.length)),
    };
  }

  if (moduleName.startsWith('@babel/runtime/')) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(path.join(babelRuntimeRoot, moduleName.slice('@babel/runtime/'.length))),
    };
  }

  const localPackage = localPackages.find((packageName) => (
    moduleName === packageName || moduleName.startsWith(`${packageName}/`)
  ));

  if (localPackage) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, { paths: [appNodeModules] }),
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
