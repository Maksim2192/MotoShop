import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { productId } =
      await params;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${productId}`,
      {
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
      "GET REVIEWS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося завантажити відгуки",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { productId } =
      await params;

    const body =
      await request.json();

    const cookieStore =
      await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/product/${productId}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Cookie:
            cookieStore.toString(),
        },

        body:
          JSON.stringify(body),

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
      "CREATE REVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося залишити відгук",
      },
      {
        status: 500,
      }
    );
  }
}