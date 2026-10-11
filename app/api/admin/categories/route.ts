
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    console.log("BACKEND STATUS:", response.status);
    console.log("BACKEND RESPONSE:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || "Backend повернув порожню відповідь" };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Невідома помилка",
      },
      { status: 500 }
    );
  }
}