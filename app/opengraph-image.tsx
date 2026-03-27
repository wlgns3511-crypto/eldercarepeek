import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ElderCarePeek - US Senior Care & Elder Care Costs by State and City';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#0d9488', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>ElderCarePeek</div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>US Senior Care &amp; Elder Care Costs by State and City</div>
      </div>
    ),
    { ...size }
  );
}
