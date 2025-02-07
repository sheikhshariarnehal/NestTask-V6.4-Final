import { lazy } from 'react';

// Helper function for lazy loading components
export function lazyLoad(path: string, namedExport: string | null = null) {
  return lazy(() => {
    const promise = import(path);
    if (namedExport == null) {
      return promise;
    }
    return promise.then(module => ({ default: module[namedExport] }));
  });
}