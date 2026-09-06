import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { productId } =
      await params;

    const cookieStore =
      await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${productId}`,
      {
        method: "POST",

        headers: {
          Cookie:
            cookieStore.toString(),
        },

        cache: "no-store",
      }
    );

    const text =
      await response.text();

    const data = text
      ? JSON.parse(text)
      : {};

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      }
    );
  } catch (error) {
    console.error(
      "ADD FAVORITE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося додати в обране",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { productId } =
      await params;

    const cookieStore =
      await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${productId}`,
      {
        method: "DELETE",

        headers: {
          Cookie:
            cookieStore.toString(),
        },

        cache: "no-store",
      }
    );

    const text =
      await response.text();

    const data = text
      ? JSON.parse(text)
      : {};

    return NextResponse.json(
      data,
      {
        status:
          response.status,
      }
    );
  } catch (error) {
    console.error(
      "DELETE FAVORITE ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося видалити з обраного",
      },
      {
        status: 500,
      }
    );
  }
}