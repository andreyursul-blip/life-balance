import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const width = Number(searchParams.get('width') || '1200');
  const height = Number(searchParams.get('height') || '2556');

  // Дата рождения
  const birthDate = new Date(1996, 11, 4); // 4 декабря 1996
  const today = new Date();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / msPerWeek);

  // Недели дней рождений (красные точки)
  const birthdayWeeks = new Set<number>();
  for (let age = 1; age <= 89; age++) {
    const bday = new Date(1996 + age, 11, 4);
    birthdayWeeks.add(Math.floor((bday.getTime() - birthDate.getTime()) / msPerWeek));
  }

  const COLS = 52;
  const ROWS = 90;
  const DOT_RADIUS = 5;
  const GAP = 3;
  const CELL = DOT_RADIUS * 2 + GAP;

  const LEFT_MARGIN = 60;   // место под цифры
  const TOP_MARGIN = 180;   // большой отступ под часы + Dynamic Island
  const RIGHT_MARGIN = 20;
  const BOTTOM_MARGIN = 60;

  const gridWidth = COLS * CELL;
  const gridHeight = ROWS * CELL;
  const totalWidth = LEFT_MARGIN + gridWidth + RIGHT_MARGIN;
  const totalHeight = TOP_MARGIN + gridHeight + BOTTOM_MARGIN;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: TOP_MARGIN,
          paddingBottom: BOTTOM_MARGIN,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <svg width={gridWidth} height={gridHeight} viewBox={`0 0 ${gridWidth} ${gridHeight}`}>
          {/* Подписи возраста слева (0 напротив первой строки = 1996–1997) */}
          {Array.from({ length: 10 }).map((_, d) => {
            const label = d * 10;
            const y = d * 10 * CELL + CELL / 2;
            return (
              <text
                key={d}
                x={LEFT_MARGIN - 10}
                y={y}
                textAnchor="end"
                fontSize="20"
                fill="#555"
                fontWeight="500"
              >
                {label}
              </text>
            );
          })}

          {/* Точки */}
          {Array.from({ length: COLS * ROWS }).map((_, w) => {
            const row = Math.floor(w / COLS);
            const col = w % COLS;
            const cx = col * CELL + CELL / 2;
            const cy = row * CELL + CELL / 2;

            let fill = '#e5e5e5'; // будущее

            if (w < weeksLived) {
              fill = birthdayWeeks.has(w) ? '#d32f2f' : '#000000';
            } else if (w === weeksLived) {
              fill = '#f57c00'; // текущая неделя
            } else if (birthdayWeeks.has(w)) {
              fill = '#d32f2f';
            }

            return <circle key={w} cx={cx} cy={cy} r={DOT_RADIUS} fill={fill} />;
          })}
        </svg>
      </div>
    ),
    { width, height }
  );
}
