import React from "react";
import HerbalErrorState from "./ui/HerbalErrorState";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("AppErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#ecfdf5_0%,#fffbeb_100%)] p-6">
          <HerbalErrorState
            title="This screen hit a snag"
            message={
              this.state.error?.message ||
              "Please refresh the page. If the problem continues, contact support."
            }
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
