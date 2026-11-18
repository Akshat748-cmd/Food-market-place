'use client';

import React from 'react';
import { HeroAvatarIllustration } from './index';

interface MascotFaceProps {
  emotion?: 'happy' | 'winking' | 'thinking' | 'neutral' | 'celebrating';
  size?: number;
  className?: string;
}

export function MascotFace({ emotion = 'happy', size = 48, className = '' }: MascotFaceProps) {
  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <HeroAvatarIllustration size={size} showOnlineDot={emotion === 'happy' || emotion === 'celebrating'} />
    </div>
  );
}
