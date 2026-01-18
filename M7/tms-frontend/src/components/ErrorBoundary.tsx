import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorMessage: React.FC<{ 
  error: Error | string; 
  onRetry?: () => void;
  className?: string;
}> = ({ error, onRetry, className = '' }) => {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-red-800">Error</h3>
      </div>
      <p className="text-red-700 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  );
};