'use client';

import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('./LiquidEther'), {
  ssr: false,
});

export default function HeroAtmosphere() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(40,174,195,0.16),transparent_28%),radial-gradient(circle_at_82%_4%,rgba(8,66,153,0.14),transparent_26%),linear-gradient(180deg,rgba(244,249,255,0.94),rgba(248,251,255,0.72))]" />

      <div className="absolute inset-x-2 top-2 h-[72%] overflow-hidden rounded-[3rem] sm:rounded-[4.2rem] corner-squircle border border-white/60 bg-white/28 shadow-[0_30px_100px_rgba(8,41,89,0.12)] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.95),rgba(0,0,0,0.58),transparent)] backdrop-blur-xl">
        <LiquidEther
          className="h-full w-full"
          colors={['#f9fcff', '#d7f4fb', '#d9e6ff', '#ffffff']}
          autoDemo
          autoSpeed={0.34}
          autoIntensity={1.4}
          mouseForce={16}
          cursorSize={120}
          resolution={0.45}
          autoResumeDelay={1400}
          autoRampDuration={0.9}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.92,
          }}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,0.02),rgba(248,251,255,0.16)_34%,rgba(248,251,255,0.82)_72%,rgba(248,251,255,1))]" />
      <div className="absolute inset-x-[10%] bottom-10 h-20 rounded-full bg-[rgba(255,255,255,0.92)] blur-3xl" />
    </div>
  );
}
