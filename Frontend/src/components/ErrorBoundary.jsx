import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    } else {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center text-white bg-navy/90 backdrop-blur-md rounded-3xl m-4 border border-white/20 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent text-2xl font-bold">
            🤿
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
            Something went off course underwater
          </h2>
          <p className="font-body text-white/70 max-w-md text-sm mb-6">
            We ran into an unexpected issue rendering this section. You can try refreshing the page or navigating back.
          </p>
          <div className="flex gap-4">
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-full bg-accent text-navy font-bold text-xs uppercase tracking-widest transition hover:bg-white shadow-md cursor-pointer"
            >
              Retry
            </button>
            <a
              href="/"
              className="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-widest border border-white/20 transition hover:bg-white/20 shadow-md"
            >
              Return Home
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
