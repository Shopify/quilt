import React from 'react';

export interface NonMutuallyExclusiveProps {
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

interface ExclusiveRenderError {
  renderError?: (error: Error) => React.ReactNode;
  fallback?: undefined;
}

interface ExclusiveFallback {
  fallback?: React.ReactNode;
  renderError?: undefined;
}

type ReactErrorBoundaryProps = NonMutuallyExclusiveProps & (ExclusiveRenderError | ExclusiveFallback);

interface State {
  error: Error | null;
}

export class ReactErrorBoundary extends React.Component<ReactErrorBoundaryProps, State> {
  state: State = {error: null};

  componentDidCatch(error: Error) {
    const {onError} = this.props;

    try {
      onError?.(error);
    } catch(error) {}

    this.setState({error});
  }

  render() {
    const {renderError, fallback, children} = this.props;

    const {error} = this.state;

    if (error) {
      return renderError?.(error) ?? fallback;
    }

    return children;
  }
}

// const foo = () => <ReactErrorBoundary fallback={<div></div>} renderError={(error) => <div></div>}>asdf</ReactErrorBoundary>
