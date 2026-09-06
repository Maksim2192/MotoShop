import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(body),

        cache: "no-store",
      }
    );

    const text =
      await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    const data = JSON.parse(text);

    const nextResponse =
      NextResponse.json(data, {
        status: response.status,
      });

    const setCookie =
      response.headers.get(
        "set-cookie"
      );

    if (setCookie) {
      nextResponse.headers.set(
        "set-cookie",
        setCookie
      );
    }

    return nextResponse;
  } catch (error) {
    console.error(
      "REGISTER API ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося зареєструватися",
      },
      {
        status: 500,
      }
    );
  }
}