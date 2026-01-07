import { NextResponse } from "next/server";

const BIRTHDATE = new Date("1996-12-04T00:00:00");

function getLifeProgress() {
  const now = new Date();

  const diffMs = now.getTime() - BIRTHDATE.getTime();
  const weeksLived = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

  const years = Math.floor(weeksLived / 52);
  const weeksAfterBirthday = weeksLived % 52;

  return { years, weeksAfterBirthday };
}

function renderGrid({
  years,
  weeksAfterBirthday,
}: {
  years: number;
  weeksAfterBirthday: number;
}) {
  const cols = 52;
  const cell = 22;
  const gap = 6;

  const startX = 80;
  const startY = 120;

  let svg = "";

  for (let y = 0; y <= 90; y++) {
    for (let w = 0; w < cols; w++) {
      const x = startX + w * (cell + gap);
      const yy = startY + y * (cell + gap);

      const filled =
        y < years || (y === years && w <= weeksAfterBirthday);

      svg += `
        <circle
          cx="${x}"
          cy="${yy}"
          r="${cell / 2}"
          fill="${filled ? "#ff4b4b" : "#d3d3d3"}"
        />
      `;
    }
  }

  return svg;
}

export async function GET() {
  const { years, weeksAfterBirthday } = getLifeProgress();

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="2000">
    <rect width="100%" height="100%" fill="white" />

    <!-- отступ под часы -->
    <g transform="translate(0, 300)">
      ${renderGrid({ years, weeksAfterBirthday })}
    </g>
  </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store",
    },
  });
}
