import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/contacts`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),

        cache: "no-store",
      }
    );

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    try {
      const data = JSON.parse(text);

      return NextResponse.json(data, {
        status: response.status,
      });
    } catch {
      return NextResponse.json(
        {
          message:
            "Backend повернув некоректну відповідь",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error(
      "CONTACT FORM ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося надіслати повідомлення",
      },
      {
        status: 500,
      }
    );
  }
}