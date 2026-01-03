import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
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
        }}
      >
        <div style={{ fontSize: 60, color: '#000' }}>
          ТЕСТ: API работает!
        </div>
      </div>
    ),
    { width, height }
  );
}
