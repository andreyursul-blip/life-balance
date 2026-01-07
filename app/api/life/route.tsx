import { NextResponse } from "next/server";

const BIRTHDATE = new Date("1996-12-04T00:00:00");

// максимальный возраст на шкале (лет)
const MAX_YEARS = 90;
const WEEKS_IN_YEAR = 52;

function getProgress() {
  const now = new Date();
  const diffMs = now.getTime() - BIRTHDATE.getTime();

  const weeksLived = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  const years = Math.floor(weeksLived / WEEKS_IN_YEAR);
  const weekOfYear = weeksLived % WEEKS_IN_YEAR;

  return { years, weekOfYear, weeksLived };
}

export async function GET() {
  const { years, weekOfYear, weeksLived } = getProgress();

  const cell = 18;
  const gap = 6;

  const startX = 140; // оставляем место под подписи лет
  const startY = 260; // отступ под часы

  let circles = "";
  let labels = "";

  let weekIndex = 0;

  for (let y = 0; y < MAX_YEARS; y++) {
    // подпись года слева
    labels += `
      <text
        x="${startX - 60}"
        y="${startY + y * (cell + gap) + 6}"
        font-size="20"
        text-anchor="end"
        fill="#777"
      >
        ${y}
      </text>
    `;

    for (let w = 0; w < WEEKS_IN_YEAR; w++) {
      const x = startX + w * (cell + gap);
      const yy = startY + y * (cell + gap);

      const filled = weekIndex <= weeksLived;

      const color =
        filled
          ? (y === years && w === weekOfYear ? "#ff9900" : "#ff4040")
          : "#d4d4d4";

      circles += `
        <circle
          cx="${x}"
          cy="${yy}"
          r="${cell / 2}"
          fill="${color}"
        />
      `;

      weekIndex++;
    }
  }

  const svg = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1300"
    height="2400"
    viewBox="0 0 1300 2400"
  >
    <rect width="100%" height="100%" fill="white" />

    ${labels}
    ${circles}
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}
