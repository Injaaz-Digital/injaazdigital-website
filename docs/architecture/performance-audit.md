# Performance audit

The final Next.js production output contains about 2.14 MiB of JavaScript chunks and 736 KiB of emitted media/font assets before compression. The largest JavaScript chunk is 516 KiB; the next application-heavy chunks are 256 KiB, 256 KiB, and 220 KiB. Three.js/WebGL, GSAP, and Framer Motion remain the dominant optional client systems.

Changes made:

- Removed the page-wide CMS hydration boundary.
- Server-rendered the hero text and CTA links; the Three.js cube is a dynamically imported client island.
- Kept the liquid simulation dynamically imported and disabled it on the hero variant that already uses Three.js, preventing two continuous WebGL systems on that hero.
- Added automatic visual quality based on viewport, DPR, reduced motion, Save-Data, hardware concurrency, and WebGL support.
- Added visibility/intersection pausing and complete cube resource disposal.
- Preserved the liquid engine's existing visibility pause, resize batching, animation cancellation, and disposal.
- Removed four unused Domaine font files (three italic weights and bold), leaving regular, medium, and semibold. This avoids roughly 320 KiB of source font payload.
- Restricted the Figma capture script to development.

The 516 KiB vendor chunk remains a genuine limitation of retaining the current Three.js/WebGL experience. The heavy experiences are now route/island split; replacing them would alter the approved visual identity and was intentionally not done.
