import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1200;
  const height = 2556;

  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11;
  const START_YEAR = 1997;

  const today = new Date();
  const startDate = new Date(START_YEAR, 0, 1);
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor(
    (today.getTime() - startDate.getTime()) / msPerWeek
  );

  const COLS = 52;
  const ROWS = 90;

  const birthdayWeeks = new Set<number>();
  for (let age = 0; age < ROWS; age++) {
    const year = START_YEAR + age;
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);
    birthdayWeeks.add(
      Math.floor((bday.getTime() - startDate.getTime()) / msPerWeek)
    );
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
        cx={col * cell + cell / 2}
        cy={row * cell + cell / 2}
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
          justifyContent: "flex-start",
          alignItems: "center",
          background: "#fff",
          paddingTop: 260, // ⬅️ увеличен отступ под часы
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
