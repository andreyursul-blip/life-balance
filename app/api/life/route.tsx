import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const width = Number(searchParams.get("width") || "1179");
  const height = Number(searchParams.get("height") || "2556");

  const birthDate = new Date(1996, 11, 4);
  const today = new Date();

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksLived = Math.floor(
    (today.getTime() - birthDate.getTime()) / msPerWeek
  );

  const birthdayWeeks = new Set<number>();
  for (let age = 1; age <= 89; age++) {
    const bday = new Date(1996 + age, 11, 4);
    birthdayWeeks.add(
      Math.floor((bday.getTime() - birthDate.getTime()) / msPerWeek)
    );
  }

  const COLS = 52;
  const ROWS = 90;

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
          paddingTop: 80,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          Life in Weeks
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 14px)`,
            gridTemplateRows: `repeat(${ROWS}, 14px)`,
            gap: 4,
          }}
        >
          {Array.from({ length: ROWS * COLS }).map((_, w) => {
            let color = "#e5e5e5";

            if (w < weeksLived)
              color = birthdayWeeks.has(w) ? "#c62828" : "#111111";
            else if (w === weeksLived)
              color = "#ff9800";
            else if (birthdayWeeks.has(w))
              color = "#c62828";

            return (
              <div
                key={w}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                }}
              />
            );
          })}
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
