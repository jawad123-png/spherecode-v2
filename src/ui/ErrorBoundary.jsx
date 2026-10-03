import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error('[SphereCode] render error:', error, info)
  }
  render() {
    if (this.state.error) {
      return (
        <pre style={{
          position: 'fixed', inset: 0, zIndex: 99999, margin: 0, padding: '40px',
          background: '#03060d', color: '#5fd6ff', font: '13px/1.6 JetBrains Mono, monospace',
          whiteSpace: 'pre-wrap', overflow: 'auto',
        }}>
          {'SphereCode crashed:\n\n' + (this.state.error.stack || this.state.error.message)}
        </pre>
      )
    }
    return this.props.children
  }
}
