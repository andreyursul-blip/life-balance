import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1200;
  const height = 2556;

  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11;
  const START_YEAR = 1996;

  const today = new Date();
  const startDate = new Date(START_YEAR, 0, 1);
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor((today.getTime() - startDate.getTime()) / msPerWeek);

  const COLS = 52;
  const ROWS = 90;

  const birthdayWeeks = new Set<number>();
  for (let age = 0; age < ROWS; age++) {
    const year = START_YEAR + age;
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);
    birthdayWeeks.add(Math.floor((bday.getTime() - startDate.getTime()) / msPerWeek));
  }

  const circles = [];
  const cell = 14;
  const r = 5;

  for (let i = 0; i < COLS * ROWS; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    let fill = "#e5e5e5";

    if (i < weeksLived) fill = birthdayWeeks.has(i) ? "#d32f2f" : "#000";
    else if (i === weeksLived) fill = "#f57c00";
    else if (birthdayWeeks.has(i)) fill = "#d32f2f";

    circles.push(
      <circle
        key={i}
        cx={col * cell}
        cy={row * cell}
        r={r}
        fill={fill}
      />
    );
  }

return new Response(
  `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600">
  <rect width="100%" height="100%" fill="black" />

  <!-- Верхний отступ под часы -->
  <g transform="translate(0, 220)">
    
    <!-- Текст возраста -->
    <text
      x="50%"
      y="40"
      text-anchor="middle"
      fill="white"
      font-size="48"
      font-family="Inter, system-ui"
    >
      ${years} лет — неделя ${weeksAfterBirthday + 1}
    </text>

    <!-- сетка жизни -->
    ${renderGrid({ years, weeksAfterBirthday })}
  </g>
</svg>
`,
  {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  }
);
