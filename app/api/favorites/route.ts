import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore =
      await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`,
      {
        method: "GET",

        headers: {
          Cookie:
            cookieStore.toString(),
        },

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

    try {
      const data =
        JSON.parse(text);

      return NextResponse.json(
        data,
        {
          status:
            response.status,
        }
      );
    } catch {
      return NextResponse.json(
        {
          message:
            "Backend повернув некоректну відповідь",
        },
        {
          status: 502,
        }
      );
    }
  } catch (error) {
    console.error(
      "GET FAVORITES ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося завантажити обране",
      },
      {
        status: 500,
      }
    );
  }
}