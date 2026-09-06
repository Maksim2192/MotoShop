import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const cookieStore =
      await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}/restore`,
      {
        method: "PATCH",

        headers: {
          Cookie:
            cookieStore.toString(),
        },

        cache: "no-store",
      }
    );

    const text =
      await response.text();

    let data;

    try {
      data = text
        ? JSON.parse(text)
        : {};
    } catch {
      return NextResponse.json(
        {
          message:
            "Backend повернув некоректну відповідь",
          response: text,
        },
        {
          status:
            response.status,
        }
      );
    }

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      }
    );
  } catch (error) {
    console.error(
      "RESTORE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося відновити замовлення",
      },
      {
        status: 500,
      }
    );
  }
}