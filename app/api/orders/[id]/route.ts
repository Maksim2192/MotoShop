import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const cookieStore =
      await cookies();

    const backendUrl =
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`;

    console.log(
      "🔥 ORDER DETAILS BACKEND:",
      backendUrl
    );

    const response = await fetch(
      backendUrl,
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

    console.log(
      "🔥 ORDER DETAILS STATUS:",
      response.status
    );

    console.log(
      "🔥 ORDER DETAILS RESPONSE:",
      text
    );

    if (!text) {
      return new NextResponse(
        null,
        {
          status:
            response.status,
        }
      );
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
          response: text,
        },
        {
          status: 502,
        }
      );
    }
  } catch (error) {
    console.error(
      "GET ORDER DETAILS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося завантажити замовлення",
      },
      {
        status: 500,
      }
    );
  }
}