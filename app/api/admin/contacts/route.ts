import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    const text = await response.text();

    if (!text) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    const data = JSON.parse(text);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "GET ADMIN CONTACTS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося завантажити повідомлення",
      },
      {
        status: 500,
      }
    );
  }
}