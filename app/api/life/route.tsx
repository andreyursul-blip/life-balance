import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1200;
  const height = 2556;

  // --- параметры жизни ---
  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11; // декабрь (0-based)
  const START_YEAR = 1997;

  const today = new Date();
  const startDate = new Date(START_YEAR, 0, 1);

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor(
    (today.getTime() - startDate.getTime()) / msPerWeek
  );

  const COLS = 52; // недель в году
  const ROWS = 90; // 90 лет

  // --- считаем недели с ДР ---
  const birthdayWeeks = new Set<number>();

  for (let age = 0; age < ROWS; age++) {
    const year = START_YEAR + age;
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);

    birthdayWeeks.add(
      Math.floor((bday.getTime() - startDate.getTime()) / msPerWeek)
    );
  }

  // --- размеры сетки ---
  const DOT = 9;
  const GAP = 4;
  const CELL = DOT + GAP;

  const LEFT_LABEL_MARGIN = 90;
  const TOP_PADDING = 180;
  const BOTTOM_PADDING = 140;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: TOP_PADDING,
          paddingBottom: BOTTOM_PADDING,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            marginBottom: 40,
            color: "#000",
          }}
        >
          Life in Weeks
        </div>

        <svg
          width={COLS * CELL + LEFT_LABEL_MARGIN}
          height={ROWS * CELL}
        >
          {/* подписи лет слева */}
          {Array.from({ length: ROWS }).map((_, i) => {
            if (i % 10 !== 0) return null;

            const y = i * CELL + DOT;

            return (
              <text
                key={`label-${i}`}
                x={LEFT_LABEL_MARGIN - 20}
                y={y}
                textAnchor="end"
                fontSize="18"
                fill="#444"
              >
                {i}
              </text>
            );
          })}

          {/* точки недель */}
          {Array.from({ length: ROWS * COLS }).map((_, w) => {
            const row = Math.floor(w / COLS);
            const col = w % COLS;

            const cx = LEFT_LABEL_MARGIN + col * CELL + DOT / 2;
            const cy = row * CELL + DOT / 2;

            let fill = "#e5e5e5";

            if (w < weeksLived)
              fill = birthdayWeeks.has(w) ? "#d32f2f" : "#000000";
            else if (w === weeksLived) fill = "#f57c00";
            else if (birthdayWeeks.has(w)) fill = "#d32f2f";

            return (
              <circle
                key={`w-${w}`}
                cx={cx}
                cy={cy}
                r={DOT / 2}
                fill={fill}
              />
            );
          })}
        </svg>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
