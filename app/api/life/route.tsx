import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Размер под iPhone 15 (по умолчанию, но можно менять через параметры)
  const width = Number(searchParams.get("width") || "1179");
  const height = Number(searchParams.get("height") || "2556");

  // --- НАСТРОЙКИ ---
  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11; // декабрь (0-based)
  const BIRTH_YEAR = 1996;

  // Начинаем сетку с 01.01.1997
  const GRID_START = new Date(1997, 0, 1);
  const today = new Date();

  const MS_WEEK = 1000 * 60 * 60 * 24 * 7;
  const weeksFromStart = Math.floor(
    (today.getTime() - GRID_START.getTime()) / MS_WEEK
  );

  const COLS = 52;   // недель в году
  const ROWS = 90;   // летовая сетка

  const DOT_RADIUS = 4.5;
  const GAP = 3;
  const CELL = DOT_RADIUS * 2 + GAP;

  // safe-area отступы под вырез / home-indicator
  const TOP_MARGIN = 180;
  const BOTTOM_MARGIN = 140;
  const LEFT_MARGIN = 90;
  const RIGHT_MARGIN = 40;

  const gridWidth = COLS * CELL;
  const gridHeight = ROWS * CELL;

  const totalWidth = LEFT_MARGIN + gridWidth + RIGHT_MARGIN;
  const totalHeight = TOP_MARGIN + gridHeight + BOTTOM_MARGIN;

  // --- посчитать недели с ДР ---
  const birthdayWeeks = new Set<number>();

  for (let age = 0; age < ROWS; age++) {
    const year = 1997 + age; // т.к. таблица с 1997
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);

    const w = Math.floor(
      (bday.getTime() - GRID_START.getTime()) / MS_WEEK
    );

    if (w >= 0) birthdayWeeks.add(w);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <svg
          width={totalWidth}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        >
          {/* лёгкое размытие краёв */}
          <defs>
            <filter id="soft">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>

          {/* ЛЕВЫЕ МЕТКИ КАЖДЫЕ 10 ЛЕТ */}
          {Array.from({ length: Math.ceil(ROWS / 10) }).map((_, i) => {
            const age = i * 10;
            const y = TOP_MARGIN + age * CELL + CELL / 2;

            return (
              <text
                key={age}
                x={LEFT_MARGIN - 16}
                y={y}
                textAnchor="end"
                fontSize="22"
                fill="#555"
                fontWeight="600"
              >
                {age}
              </text>
            );
          })}

          {/* ТОЧКИ-НЕДЕЛИ */}
          {Array.from({ length: COLS * ROWS }).map((_, w) => {
            const row = Math.floor(w / COLS);
            const col = w % COLS;

            const cx = LEFT_MARGIN + col * CELL + CELL / 2;
            const cy = TOP_MARGIN + row * CELL + CELL / 2;

            let color = "#e5e5e5"; // будущее

            if (w < weeksFromStart)
              color = birthdayWeeks.has(w) ? "#d32f2f" : "#000000";
            else if (w === weeksFromStart)
              color = "#f57c00"; // текущая неделя
            else if (birthdayWeeks.has(w))
              color = "#d32f2f";

            return (
              <circle
                key={w}
                cx={cx}
                cy={cy}
                r={DOT_RADIUS}
                fill={color}
                filter="url(#soft)"
              />
            );
          })}
        </svg>
      </div>
    ),
    { width, height }
  );
}
