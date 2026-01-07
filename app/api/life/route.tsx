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

 function renderGrid({ years, weeksAfterBirthday }: { years: number, weeksAfterBirthday: number }) {
  const cols = 52;
  const cell = 22;
  const gap = 6;

  const startX = 80;
  const startY = 120;

  let svg = '';

  for (let y = 0; y <= years; y++) {
    for (let w = 0; w < cols; w++) {
      const x = startX + w * (cell + gap);
      const yy = startY + y * (cell + gap);

      const filled =
        y < years ||
        (y === years && w <= weeksAfterBirthday);

      svg += `
        <circle
          cx="${x}"
          cy="${yy}"
          r="${cell / 2}"
          fill="${filled ? '#ff4b4b' : '#d0d0d0'}"
        />
      `;
    }
  }

  return svg;
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
