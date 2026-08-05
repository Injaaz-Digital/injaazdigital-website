'use client';

import dynamic from 'next/dynamic';

const HeroCubeStage = dynamic(() => import('./HeroCubeStage'), {
  ssr: false,
  loading: () => <div className="aspect-square w-full max-w-[560px] animate-pulse rounded-[2.4rem] bg-[radial-gradient(circle,rgba(40,174,195,0.16),transparent_68%)]" aria-hidden="true" />,
});

export default function HeroVisualClient() {
  return <HeroCubeStage />;
}
