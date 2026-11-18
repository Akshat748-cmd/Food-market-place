'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  const storeHydrated = useAppStore((state) => state.isHydrated);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated || storeHydrated;
}
