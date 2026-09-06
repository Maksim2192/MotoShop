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

    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts/${id}/read`,
      {
        method: "PATCH",

        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

    const text = await response.text();

    const data = text
      ? JSON.parse(text)
      : {};

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "READ CONTACT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося оновити повідомлення",
      },
      {
        status: 500,
      }
    );
  }
}