// Polyfill for React 'use' hook for compatibility with React 18.2.0
// The 'use' hook is experimental and only available in React 18.3.0+
// This is a minimal polyfill that should work for basic cases

if (typeof React !== 'undefined' && !React.use) {
  // Simple polyfill - handles promises in a basic way
  React.use = function(promise) {
    if (promise && typeof promise.then === 'function') {
      throw promise; // Let Suspense handle it
    }
    return promise;
  };
}
