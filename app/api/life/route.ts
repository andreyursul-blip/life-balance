import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const width = Number(searchParams.get('width') || '1179');
  const height = Number(searchParams.get('height') || '2556');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '48px',
          fontWeight: 'bold',
        }}
      >
        ТЕСТ: API РАБОТАЕТ 2026!
      </div>
    ),
    { width, height }
  );
}
