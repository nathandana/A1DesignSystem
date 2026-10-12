import { nodeUnit } from './graph-model.js'

export const initialNodes = [
  { id: 'tokens', label: 'Tokens', x: nodeUnit, y: nodeUnit * 3, color: 'accent' },
  { id: 'react', label: 'React', x: nodeUnit * 3.5, y: nodeUnit, color: 'info' },
  { id: 'html', label: 'HTML / CSS', x: nodeUnit * 3.5, y: nodeUnit * 3, color: 'success' },
  { id: 'native', label: 'Native', x: nodeUnit * 3.5, y: nodeUnit * 5, color: 'warn' },
  { id: 'apps', label: 'Apps', x: nodeUnit * 6, y: nodeUnit * 3, color: 'info' },
  { id: 'preview', label: 'Preview', x: nodeUnit * 8.5, y: nodeUnit * 3, color: 'success' },
]
export const initialConnections = [
  { id: 'tokens-react', from: 'tokens', to: 'react' },
  { id: 'tokens-html', from: 'tokens', to: 'html' },
  { id: 'tokens-native', from: 'tokens', to: 'native' },
  { id: 'react-apps', from: 'react', to: 'apps' },
  { id: 'html-apps', from: 'html', to: 'apps' },
  { id: 'native-apps', from: 'native', to: 'apps' },
  { id: 'apps-preview', from: 'apps', to: 'preview' },
]
