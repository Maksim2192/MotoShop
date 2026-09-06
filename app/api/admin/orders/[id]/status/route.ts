import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    console.log(
      "UPDATE ORDER STATUS:",
      response.status
    );

    console.log(
      "UPDATE ORDER RESPONSE:",
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
            "Backend повернув не JSON",
          response: text,
        },
        {
          status: response.status,
        }
      );
    }
  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося змінити статус",
      },
      {
        status: 500,
      }
    );
  }
}