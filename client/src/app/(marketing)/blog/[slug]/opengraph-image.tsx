import { ImageResponse } from 'next/og';
import { getCmsPage } from '@/features/cms/lib/cms-page';

export const alt = 'Injaaz Digital article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cms = await getCmsPage(`/blog/${slug}`, 'en');
  const article = cms.data?.type === 'blog-post' ? cms.data.article : null;
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, color: '#0a2546', background: 'linear-gradient(135deg,#f8fbff 0%,#e8f4ff 58%,#d7f4f5 100%)' }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#0b5da8' }}>INJAAZ DIGITAL</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}><div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-0.04em', maxWidth: 1040 }}>{article?.title || 'Injaaz Digital Insights'}</div>{article?.excerpt ? <div style={{ fontSize: 28, lineHeight: 1.35, color: '#456587', maxWidth: 960 }}>{article.excerpt.slice(0, 180)}</div> : null}</div>
      <div style={{ fontSize: 24, color: '#1685a1' }}>Systems for measurable digital growth</div>
    </div>, size,
  );
}
