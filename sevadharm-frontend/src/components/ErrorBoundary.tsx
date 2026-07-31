import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 max-w-md text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Interface Error</h2>
            <p className="text-sm text-neutral-500 mb-6">
              A temporary rendering issue occurred in this section. Your medical records and state remain completely safe.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
            >
              <RefreshCw className="w-4 h-4" /> Reload Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;