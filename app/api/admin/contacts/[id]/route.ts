import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  _request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts/${id}`,
      {
        method: "DELETE",

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
      "DELETE CONTACT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося видалити повідомлення",
      },
      {
        status: 500,
      }
    );
  }
}