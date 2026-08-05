import { ImageResponse } from 'next/og';

export const alt = 'Injaaz Digital';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, color: '#fff', background: 'linear-gradient(135deg,#081a30 0%,#084299 62%,#28aec3 100%)' }}>
      <div style={{ fontSize: 30, fontWeight: 700 }}>INJAAZ DIGITAL</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}><div style={{ fontSize: 72, lineHeight: 1.02, fontWeight: 700, letterSpacing: '-0.04em', maxWidth: 1060 }}>Digital systems built for measurable growth.</div><div style={{ fontSize: 30, lineHeight: 1.35, color: '#d7e9f6', maxWidth: 900 }}>Strategy, web experiences, qualification, and booking connected as one conversion platform.</div></div>
      <div style={{ fontSize: 24, color: '#b9eef2' }}>injaazdigital.com</div>
    </div>, size,
  );
}
