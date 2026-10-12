import '../../../build/css/tokens.css'
import '../../../packages/react/src/themes.css'
import '../../../packages/react/src/color-scheme.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
