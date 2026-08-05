'use client';
import { useEffect, useState } from 'react';
export const useHeaderVisibility = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => { let rafId = 0; const onScroll = () => { if (rafId) return; rafId = window.requestAnimationFrame(() => { const next = Math.max(0, Math.min(1, window.scrollY / 140)); setScrollProgress((previous) => Math.abs(previous - next) < 0.004 ? previous : next); rafId = 0; }); }; onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => { window.removeEventListener('scroll', onScroll); if (rafId) window.cancelAnimationFrame(rafId); }; }, []);
  return { scrollProgress, hasScrolled: scrollProgress > 0.06, headerMaxWidth: 1200 - scrollProgress * 400 };
};
