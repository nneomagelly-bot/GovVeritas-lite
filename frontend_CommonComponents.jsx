// frontend/src/components/Common/StatusBadge.jsx
export function StatusBadge({ status }) {
  const statusConfig = {
    'complete': { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Complete' },
    'near_complete': { bg: 'bg-green-50', text: 'text-green-700', label: '✓ Nearly Ready' },
    'good': { bg: 'bg-blue-100', text: 'text-blue-800', label: '✓ Good' },
    'in_progress': { bg: 'bg-blue-50', text: 'text-blue-700', label: '→ In Progress' },
    'progressing': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: '→ Progressing' },
    'at_risk': { bg: 'bg-red-100', text: 'text-red-800', label: '! At Risk' }
  };

  const config = statusConfig[status] || statusConfig['at_risk'];

  return (
    <span className={`inline-block px-3 py-1 rounded text-xs font-500 ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

// frontend/src/components/Common/LoadingSpinner.jsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#001F3F]"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// frontend/src/components/Common/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-[#001F3F] text-white rounded-lg font-500 hover:bg-[#003366]"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
