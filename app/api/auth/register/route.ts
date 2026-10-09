import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("REGISTER API ERROR: NEXT_PUBLIC_API_URL is missing");

      return NextResponse.json(
        { message: "API URL не налаштовано на сервері" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${apiUrl.replace(/\/+$/, "")}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      console.error(
        "REGISTER API: Backend returned non-JSON response",
        response.status,
        text
      );

      return NextResponse.json(
        { message: "Бекенд повернув некоректну відповідь" },
        { status: 502 }
      );
    }

    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });

    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
  } catch (error) {
    console.error("REGISTER API ERROR:", error);

    return NextResponse.json(
      { message: "Не вдалося зв'язатися з сервером реєстрації" },
      { status: 502 }
    );
  }
}