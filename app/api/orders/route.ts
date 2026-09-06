import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore =
      await cookies();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
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

    console.log(
      "MY ORDERS STATUS:",
      response.status
    );

    console.log(
      "MY ORDERS RESPONSE:",
      text
    );

    if (!text) {
      return new NextResponse(
        null,
        {
          status:
            response.status,
        }
      );
    }

    try {
      const data =
        JSON.parse(text);

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
            "Backend повернув некоректну відповідь",
        },
        {
          status: 502,
        }
      );
    }
  } catch (error) {
    console.error(
      "GET ORDERS ERROR:",
      error
    );

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

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(body),

        cache: "no-store",
      }
    );

    const text =
      await response.text();

    console.log(
      "CREATE ORDER STATUS:",
      response.status
    );

    console.log(
      "CREATE ORDER RESPONSE:",
      text
    );

    if (!text) {
      return new NextResponse(
        null,
        {
          status:
            response.status,
        }
      );
    }

    try {
      const data =
        JSON.parse(text);

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
            "Backend повернув некоректну відповідь",
        },
        {
          status: 502,
        }
      );
    }
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося оформити замовлення",
      },
      {
        status: 500,
      }
    );
  }
}