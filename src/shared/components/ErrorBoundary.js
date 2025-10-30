/**
 * ErrorBoundary Component - Legacy wrapper
 * This component is now a wrapper around the Tamagui ErrorBoundary
 * For new code, import directly from '@/components/tamagui'
 */
import React from 'react';
import ErrorBoundaryTamagui from '../../../components/tamagui/ErrorBoundary';

  render() {
    return <ErrorBoundaryTamagui onReset={this.props.onReset}>{this.props.children}</ErrorBoundaryTamagui>;
  }
}

export default ErrorBoundary;
