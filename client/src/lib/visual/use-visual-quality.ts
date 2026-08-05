'use client';

import { useEffect, useState } from 'react';
import { resolveVisualQuality, type VisualQuality } from './visual-quality';

const detect = (requested: VisualQuality) => {
  if (typeof window === 'undefined') return requested === 'auto' ? 'medium' : requested;
  let webgl = false;
  try { const canvas = document.createElement('canvas'); webgl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')); } catch { webgl = false; }
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return resolveVisualQuality(requested, {
    width: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio || 1,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: connection?.saveData === true,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    webgl,
  });
};

export const useVisualQuality = (requested: VisualQuality = 'auto') => {
  const [quality, setQuality] = useState(() => detect(requested));
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setQuality(detect(requested));
    update(); window.addEventListener('resize', update, { passive: true }); media.addEventListener('change', update);
    return () => { window.removeEventListener('resize', update); media.removeEventListener('change', update); };
  }, [requested]);
  return quality;
};
