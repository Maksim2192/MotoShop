import { NextResponse } from "next/server";
import { cookies } from "next/headers";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL;


export async function DELETE(
  request: Request
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        {
          message:
            "NEXT_PUBLIC_API_URL не налаштований",
        },
        {
          status: 500,
        }
      );
    }


    const body =
      await request.json();


    const cookieStore =
      await cookies();

    const cookieHeader =
      cookieStore.toString();


    const response =
      await fetch(
        `${API_URL}/api/admin/products/bulk`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            Cookie:
              cookieHeader,
          },

          body:
            JSON.stringify(
              body
            ),

          cache:
            "no-store",
        }
      );


    const text =
      await response.text();


    let data;


    try {
      data =
        text
          ? JSON.parse(text)
          : {};
    } catch {
      data = {
        message:
          "Backend повернув некоректну відповідь",

        response:
          text,
      };
    }


    return NextResponse.json(
      data,
      {
        status:
          response.status,
      }
    );
  } catch (error) {
    console.error(
      "BULK DELETE PROXY ERROR:",
      error
    );


    return NextResponse.json(
      {
        message:
          "Помилка масового видалення товарів",
      },
      {
        status: 500,
      }
    );
  }
}