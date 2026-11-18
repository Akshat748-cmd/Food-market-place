'use client';

import { useEffect } from 'react';

/**
 * Locks background scrolling when a modal, drawer, or overlay is open.
 * Uses scrollbar-gutter: stable to prevent layout shifting.
 */
export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock || typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;

    // Lock page scrolling
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollbarGutter = '';
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
    };
  }, [lock]);
}
