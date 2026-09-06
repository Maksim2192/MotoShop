import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface RouteProps {
params: Promise<{
id: string;
}>;
}

export async function GET(
_request: Request,
{ params }: RouteProps
) {
try {
const { id } = await params;

    const cookieStore = await cookies();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        }
    );

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        return NextResponse.json(
            {
                message: "Backend повернув некоректну відповідь",
                status: response.status,
                response: text,
            },
            {
                status: response.status,
            }
        );
    }

    return NextResponse.json(data, {
        status: response.status,
    });
} catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
        {
            message: "Не вдалося отримати товар",
        },
        {
            status: 500,
        }
    );
}

}

export async function PATCH(
request: Request,
{ params }: RouteProps
) {
try {
const { id } = await params;

    const body = await request.json();

    const cookieStore = await cookies();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieStore.toString(),
            },
            body: JSON.stringify(body),
        }
    );

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        return NextResponse.json(
            {
                message: "Backend повернув некоректну відповідь",
                status: response.status,
                response: text,
            },
            {
                status: response.status,
            }
        );
    }

    return NextResponse.json(data, {
        status: response.status,
    });
} catch (error) {
    console.error("PATCH PRODUCT ERROR:", error);

    return NextResponse.json(
        {
            message: "Не вдалося оновити товар",
        },
        {
            status: 500,
        }
    );
}

}

export async function DELETE(
_request: Request,
{ params }: RouteProps
) {
try {
const { id } = await params;

    const cookieStore = await cookies();

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`,
        {
            method: "DELETE",
            headers: {
                Cookie: cookieStore.toString(),
            },
        }
    );

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        return NextResponse.json(
            {
                message: "Backend повернув некоректну відповідь",
                status: response.status,
                response: text,
            },
            {
                status: response.status,
            }
        );
    }

    return NextResponse.json(data, {
        status: response.status,
    });
} catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
        {
            message: "Не вдалося видалити товар",
        },
        {
            status: 500,
        }
    );
}

}
