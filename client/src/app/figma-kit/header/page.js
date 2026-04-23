import HeaderPreviewClient from '@/features/figma-kit/HeaderPreviewClient';

export default async function FigmaKitHeaderPage({ searchParams }) {
  const params = await searchParams;
  const state = typeof params?.state === 'string' ? params.state : 'default';

  return <HeaderPreviewClient state={state} />;
}
