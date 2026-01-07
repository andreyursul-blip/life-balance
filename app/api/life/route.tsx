import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1200;
  const height = 2556;

  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11;
  const birthDate = new Date(1996, BIRTH_MONTH, BIRTH_DAY); // 04.12.1996

  const today = new Date();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor((today.getTime() - birthDate.getTime()) / msPerWeek);

  const COLS = 52;
  const ROWS = 90;

  const birthdayWeeks = new Set<number>();
  for (let age = 0; age < ROWS; age++) {
    const year = 1996 + age;
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);
    birthdayWeeks.add(Math.floor((bday.getTime() - birthDate.getTime()) / msPerWeek));
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          paddingTop: 220,   // ← увеличил отступ сверху (под часы)
          paddingBottom: 140,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Заголовок убрал полностью */}

        <svg
          width={COLS * cell}
          height={ROWS * cell}
          style={{ marginLeft: 90 }}
        >
          {/* Подписи возраста (0 напротив первой строки) */}
          {Array.from({ length: 10 }).map((_, d) => {
            const label = d * 10;
            const y = d * 10 * cell + cell / 2 + 10; // ← подправил позицию Y, чтобы не поехало по диагонали
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

          {circles}
        </svg>
      </div>
    ),
    { width, height }
  );
}
