import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1179;
  const height = 2556;

  // ---- ТВОИ ДАННЫЕ ----
  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11; // декабрь = 11
  const BIRTH_YEAR = 1996;

  const COLS = 52;
  const ROWS = 90;

  const TOP_PADDING = 320; // для лок-экрана iOS

  const startDate = new Date(BIRTH_YEAR, BIRTH_MONTH, BIRTH_DAY);
  const today = new Date();

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor(
    (today.getTime() - startDate.getTime()) / msPerWeek
  );

  // ---- НЕДЕЛИ ДР ----
  const birthdayWeeks = new Set<number>();

  for (let age = 0; age < ROWS; age++) {
    const year = BIRTH_YEAR + age;
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);

    const w = Math.floor(
      (bday.getTime() - startDate.getTime()) / msPerWeek
    );

    birthdayWeeks.add(w);
  }

  // ---- РЕНДЕР ТОЧЕК ----
  const cells = [];

  for (let w = 0; w < COLS * ROWS; w++) {
    let bg = "#e5e5e5"; // будущие недели

    if (w < weeksLived) {
      bg = birthdayWeeks.has(w) ? "#d32f2f" : "#000000"; // прожитые
    } else if (w === weeksLived) {
      bg = "#f57c00"; // текущая неделя
    } else if (birthdayWeeks.has(w)) {
      bg = "#d32f2f"; // будущие ДР
    }

    cells.push(
      <div
        key={w}
        style={{
          width: 10,
          height: 10,
          background: bg,
          borderRadius: "50%",
        }}
      />
    );
  }

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
          paddingBottom: 140,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 13px)`,
            gap: "3px",
            justifyContent: "center",
          }}
        >
          {cells}
        </div>
      </div>
    ),
    { width, height }
  );
}
