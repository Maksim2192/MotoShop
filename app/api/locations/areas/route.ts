import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://decentralization.gov.ua/api/areas",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            "Не вдалося отримати список областей",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "AREAS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Помилка отримання областей",
      },
      {
        status: 500,
      }
    );
  }
}