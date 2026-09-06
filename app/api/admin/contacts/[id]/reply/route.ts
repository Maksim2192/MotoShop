import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cookieStore = await cookies();

    const backendUrl =
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts/${id}/reply`;

    console.log(
      "🔥 REPLY BACKEND URL:",
      backendUrl
    );

    const response = await fetch(
      backendUrl,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },

        body: JSON.stringify(body),

        cache: "no-store",
      }
    );

    const text = await response.text();

    console.log(
      "🔥 REPLY STATUS:",
      response.status
    );

    console.log(
      "🔥 REPLY RESPONSE:",
      text
    );

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
          status: 502,
        }
      );
    }
  } catch (error) {
    console.error(
      "🔥 REPLY ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося відправити відповідь",
      },
      {
        status: 500,
      }
    );
  }
}