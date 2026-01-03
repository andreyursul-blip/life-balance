import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const width = Number(searchParams.get('width') || '1179');
  const height = Number(searchParams.get('height') || '2556');

  const birthDate = new Date(1996, 11, 4);
  const today = new Date();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / msPerWeek);

  const birthdayWeeks = new Set<number>();
  for (let age = 1; age <= 89; age++) {
    const bday = new Date(1996 + age, 11, 4);
    birthdayWeeks.add(Math.floor((bday.getTime() - birthDate.getTime()) / msPerWeek));
  }

  const COLS = 52;
  const ROWS = 90;
  const DOT_RADIUS = 4.5;
  const GAP = 2.8;
  const CELL = DOT_RADIUS * 2 + GAP;

  const LEFT_MARGIN = 60;
  const TOP_MARGIN = 140;
  const RIGHT_MARGIN = 20;
  const BOTTOM_MARGIN = 60;

  const gridWidth = COLS * CELL;
  const gridHeight = ROWS * CELL;
  const totalWidth = LEFT_MARGIN + gridWidth + RIGHT_MARGIN;
  const totalHeight = TOP_MARGIN + gridHeight + BOTTOM_MARGIN;

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: 36, fontWeight: 'bold', marginTop: 20, color: '#333' }}>Life in Weeks</div>
      <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
        {Array.from({ length: 10 }).map((_, d) => {
          const label = d * 10;
          const y = TOP_MARGIN + d * 10 * CELL + CELL / 2;
          return <text key={d} x={LEFT_MARGIN - 10} y={y} textAnchor="end" fontSize="20" fill="#555" fontWeight="500">{label}</text>;
        })}
        {Array.from({ length: COLS * ROWS }).map((_, w) => {
          const row = Math.floor(w / COLS);
          const col = w % COLS;
          const cx = LEFT_MARGIN + col * CELL + CELL / 2;
          const cy = TOP_MARGIN + row * CELL + CELL / 2;
          let color = '#e5e5e5';
          if (w < weeksLived) color = birthdayWeeks.has(w) ? '#d32f2f' : '#222222';
          else if (w === weeksLived) color = '#f57c00';
          else color = birthdayWeeks.has(w) ? '#d32f2f' : '#e5e5e5';
          return <circle key={w} cx={cx} cy={cy} r={DOT_RADIUS} fill={color} />;
        })}
      </svg>
    </div>,
    { width, height }
  );
} 
