import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1200;
  const height = 2556;

  // старт строго с дня рождения
  const startDate = new Date(1996, 11, 4); // 04.12.1996
  const today = new Date();

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor(
    (today.getTime() - startDate.getTime()) / msPerWeek
  );

  const COLS = 52;
  const ROWS = 90;

  const cell = 16;
  const r = 5.5;

  const circles = [];

  for (let i = 0; i < COLS * ROWS; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;

    let fill = "#e5e5e5";
    if (i < weeksLived) fill = "#000";
    else if (i === weeksLived) fill = "#f57c00";

    circles.push(
      <circle
        key={i}
        cx={col * cell + r}
        cy={row * cell + r}
        r={r}
        fill={fill}
      />
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          background: "#fff",
          paddingTop: 260, // безопасно под часы
          paddingBottom: 160,
        }}
      >
        <svg
          width={COLS * cell}
          height={ROWS * cell}
        >
          {circles}
        </svg>
      </div>
    ),
    { width, height }
  );
}
