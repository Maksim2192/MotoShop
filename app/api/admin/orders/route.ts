import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
  try {
    const cookieStore =
      await cookies();

    const { searchParams } =
      new URL(request.url);

    const archived =
      searchParams.get(
        "archived"
      );

    const backendParams =
      new URLSearchParams();

    if (
      archived === "true" ||
      archived === "false"
    ) {
      backendParams.set(
        "archived",
        archived
      );
    }

    const query =
      backendParams.toString();

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/admin/orders${
        query ? `?${query}` : ""
      }`,
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

    if (!text) {
      return new NextResponse(
        null,
        {
          status:
            response.status,
        }
      );
    }

    let data;

    try {
      data =
        JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          message:
            "Backend повернув не JSON",
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
  } catch {
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