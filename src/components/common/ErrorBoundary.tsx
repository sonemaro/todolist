import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log error for debugging/monitoring
    console.error('ErrorBoundary caught error:', error, info);
  }

  handleRetry = () => {
    // Reset error state and try rendering children again
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
            خطای داخلی رخ داد / Internal Error Occurred
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            لطفاً صفحه را دوباره بارگذاری کنید یا دکمه «تلاش مجدد» را بزنید.
            <br />
            Please reload the page or press the Retry button.
          </p>
          {this.state.error && (
            <details className="mt-3 text-xs text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-800/50 p-3 rounded">
              <summary className="cursor-pointer font-medium">Technical Details</summary>
              <pre className="mt-2 text-left overflow-auto">{String(this.state.error.message)}</pre>
            </details>
          )}
          <div className="mt-6">
            <button 
              onClick={this.handleRetry} 
              className="px-6 py-3 rounded-xl bg-pastel-mint hover:bg-pastel-mint/90 text-white font-medium
                       shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              تلاش مجدد / Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}