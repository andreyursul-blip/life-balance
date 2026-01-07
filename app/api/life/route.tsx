import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const width = 1179;  // айфон 15 Pro
  const height = 2556;

  const BIRTH_DAY = 4;
  const BIRTH_MONTH = 11; // 0-based, декабрь = 11
  const START_YEAR = 1996; // начинаем с твоего дня рождения

  const today = new Date();
  const startDate = new Date(START_YEAR, BIRTH_MONTH, BIRTH_DAY);
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor((today.getTime() - startDate.getTime()) / msPerWeek);

  const COLS = 52;  // недель в году
  const ROWS = 90;  // лет

  const birthdayWeeks = new Set<number>();
  for (let age = 0; age < ROWS; age++) {
    const year = START_YEAR + age;
    const bday = new Date(year, BIRTH_MONTH, BIRTH_DAY);
    birthdayWeeks.add(Math.floor((bday.getTime() - startDate.getTime()) / msPerWeek));
  }

  const cells = [];
  for (let w = 0; w < COLS * ROWS; w++) {
    let bg = "#000"; // черные для прожитых недель
    if (w === weeksLived) bg = "#f57c00"; // текущая неделя оранжевая
    if (birthdayWeeks.has(w)) bg = "#d32f2f"; // дни рождения красные

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

  // Добавляем подписи лет слева
  const yearLabels = [];
  for (let y = 0; y <= ROWS; y += 10) {
    yearLabels.push(
      <div
        key={y}
        style={{
          position: "absolute",
          left: 20,
          top: 40 + y * 12 * 1.057, // клетка + gap ~14px
          fontSize: 20,
          fontWeight: 500,
          color: "#555",
        }}
      >
        {y}
      </div>
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
          alignItems: "flex-start",
          background: "#fff",
          paddingTop: 220, // увеличенный отступ сверху
          paddingBottom: 140,
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {yearLabels}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 14px)`,
            gap: "3px",
            marginLeft: 60,
          }}
        >
          {cells}
        </div>
      </div>
    ),
    { width, height }
  );
}
