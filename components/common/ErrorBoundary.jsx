import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-3.5rem)] grid place-content-center bg-[#000814] text-[#F1F2F3]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-[#999DAA] mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#FFD60A] text-[#000000] px-4 py-2 rounded-md font-semibold hover:scale-95 transition-transform duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 