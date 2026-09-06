import { NextResponse } from "next/server";

export async function GET(
  request: Request
) {
  try {
    const { searchParams } =
      new URL(request.url);

    const cityRef =
      searchParams.get("cityRef");

    if (!cityRef) {
      return NextResponse.json(
        {
          message:
            "Не передано cityRef",
        },
        {
          status: 400,
        }
      );
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

          modelName:
            "AddressGeneral",

          calledMethod:
            "getWarehouses",

          methodProperties: {
            CityRef: cityRef,
            Limit: "500",
          },
        }),

        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!result.success) {
      console.error(
        "NOVA POSHTA WAREHOUSES ERROR:",
        result.errors
      );

      return NextResponse.json(
        {
          message:
            result.errors?.[0] ||
            "Не вдалося отримати відділення",
        },
        {
          status: 400,
        }
      );
    }

    const warehouses =
      result.data.map(
        (warehouse: {
          Ref: string;
          Description: string;
          Number?: string;
          ShortAddress?: string;
          CategoryOfWarehouse?: string;
        }) => ({
          ref: warehouse.Ref,

          name:
            warehouse.Description,

          number:
            warehouse.Number ?? "",

          address:
            warehouse.ShortAddress ?? "",

          category:
            warehouse.CategoryOfWarehouse ??
            "",
        })
      );

    return NextResponse.json({
      data: warehouses,
    });
  } catch (error) {
    console.error(
      "NOVA POSHTA WAREHOUSES ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Не вдалося отримати відділення",
      },
      {
        status: 500,
      }
    );
  }
}