import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ui/ErrorBoundary.jsx'
import './index.css'

// surface any runtime error on-screen instead of failing to a black canvas
function showErr(msg) {
  let d = document.getElementById('globalErr')
  if (!d) {
    d = document.createElement('pre')
    d.id = 'globalErr'
    d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:45vh;z-index:99998;margin:0;padding:16px 20px;background:rgba(2,10,20,.94);color:#7fe0ff;font:12px/1.5 JetBrains Mono,monospace;white-space:pre-wrap;overflow:auto;border-top:1px solid #7fe0ff'
    document.body.appendChild(d)
  }
  d.textContent += msg + '\n'
}
window.addEventListener('error', (e) => showErr('⛔ ' + e.message + '  (' + (e.filename || '') + ':' + e.lineno + ')'))
window.addEventListener('unhandledrejection', (e) => showErr('⛔ promise: ' + (e.reason?.message || e.reason)))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
