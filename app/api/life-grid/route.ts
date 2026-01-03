import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = Number(searchParams.get('width') || '1179');
  const height = Number(searchParams.get('height') || '2556');

  const birth = new Date(1996, 11, 4);
  const today = new Date();
  const weeksLived = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 40 }}>
          Life in Weeks
        </div>
        <div style={{ fontSize: 120, color: '#f00' }}>
          Текущая неделя: {weeksLived}
        </div>
        <div style={{ fontSize: 32, marginTop: 20 }}>
          (полный грид скоро добавлю)
        </div>
      </div>
    ),
    { width, height }
  );
}
