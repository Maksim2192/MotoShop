import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    const text = await response.text();

    const data = text
      ? JSON.parse(text)
      : {};

    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    nextResponse.cookies.delete("accessToken");

    return nextResponse;
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        message: "Не вдалося вийти",
      },
      {
        status: 500,
      }
    );
  }
}