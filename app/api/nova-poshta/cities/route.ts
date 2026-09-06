import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const search =
      searchParams.get("search")?.trim() ?? "";

    if (search.length < 2) {
      return NextResponse.json({
        data: [],
      });
    }

    const apiKey =
      process.env.NOVA_POSHTA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "NOVA_POSHTA_API_KEY не встановлений",
        },
        {
          status: 500,
        }
      );
    }

    const response = await fetch(
      "https://api.novaposhta.ua/v2.0/json/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          apiKey,

          modelName: "Address",

          calledMethod: "getCities",

          methodProperties: {
            FindByString: search,
            Limit: "20",
          },
        }),

        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!result.success) {
      console.error(
        "NOVA POSHTA CITIES ERROR:",
        result.errors
      );

      return NextResponse.json(
        {
          message:
            result.errors?.[0] ||
            "Не вдалося знайти міста",
        },
        {
          status: 400,
        }
      );
    }

    const cities = result.data.map(
      (city: {
        Ref: string;
        Description: string;
        AreaDescription?: string;
        SettlementTypeDescription?: string;
      }) => ({
        ref: city.Ref,
        name: city.Description,
        area:
          city.AreaDescription ?? "",
        type:
          city.SettlementTypeDescription ?? "",
      })
    );

    return NextResponse.json({
      data: cities,
    });
  } catch (error) {
    console.error(
      "NOVA POSHTA CITIES ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося отримати міста",
      },
      {
        status: 500,
      }
    );
  }
}