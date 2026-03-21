
'use client';

import { useMemo, useRef } from 'react';

export function useMemoFirebase<T>(factory: () => T, dependencies: any[]): T {
  const ref = useRef<T | null>(null);
  const lastDeps = useRef<any[]>(dependencies);

  const depsChanged = dependencies.some((dep, i) => dep !== lastDeps.current[i]);

  if (!ref.current || depsChanged) {
    ref.current = factory();
    lastDeps.current = dependencies;
  }

  return ref.current;
}
