"use client";

import {
    useEffect,
    useState,
} from "react";
import Link from "next/link";
import {
    useParams,
    useRouter,
} from "next/navigation";
import ReviewForm from "@/components/ReviewForm/ReviewForm";

import styles from "./page.module.css";

interface OrderItem {
    id: number;
    productId: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;

    status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

    total: number;

    customerName: string;
    email: string;
    phone: string;

    city: string;
    department: string | null;

    deliveryType: string;
    payment: string;

    comment: string | null;

    createdAt: string;

    items: OrderItem[];
}

const statusText: Record<
    Order["status"],
    string
> = {
    PENDING: "Очікує підтвердження",
    CONFIRMED: "Підтверджено",
    SHIPPED: "Відправлено",
    DELIVERED: "Доставлено",
    CANCELLED: "Скасовано",
};

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [order, setOrder] =
        useState<Order | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setError("");

                const response = await fetch(
                    `/api/orders/${id}`,
                    {
                        cache: "no-store",
                    }
                );

                const text =
                    await response.text();

                let result;

                try {
                    result = text
                        ? JSON.parse(text)
                        : {};
                } catch {
                    throw new Error(
                        "Сервер повернув некоректну відповідь"
                    );
                }

                if (response.status === 401) {
                    router.push("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Не вдалося завантажити замовлення"
                    );
                }

                setOrder(result.data);
            } catch (error) {
                console.error(
                    "LOAD ORDER ERROR:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Не вдалося завантажити замовлення"
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadOrder();
        }
    }, [id, router]);

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        Завантаження замовлення...
                    </div>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.error}>
                        {error ||
                            "Замовлення не знайдено"}
                    </div>

                    <Link
                        href="/profile/orders"
                        className={styles.backLink}
                    >
                        ← До замовлень
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <span className={styles.label}>
                            Особистий кабінет
                        </span>

                        <h1>
                            Замовлення #{order.id}
                        </h1>

                        <p>
                            Детальна інформація про
                            замовлення.
                        </p>
                    </div>

                    <Link
                        href="/profile/orders"
                        className={styles.backLink}
                    >
                        ← До замовлень
                    </Link>
                </header>

                <section className={styles.statusCard}>
                    <div>
                        <span>Поточний статус</span>

                        <strong>
                            {statusText[order.status]}
                        </strong>
                    </div>

                    <span
                        className={`${styles.status} ${styles[
                            `status${order.status}`
                            ]
                            }`}
                    >
                        {statusText[order.status]}
                    </span>
                </section>

                <div className={styles.grid}>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span>01</span>
                            <h2>Отримувач</h2>
                        </div>

                        <div className={styles.infoList}>
                            <div>
                                <span>
                                    Ім&apos;я
                                </span>

                                <strong>
                                    {order.customerName}
                                </strong>
                            </div>

                            <div>
                                <span>Email</span>

                                <strong>
                                    {order.email}
                                </strong>
                            </div>

                            <div>
                                <span>Телефон</span>

                                <strong>
                                    {order.phone}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span>02</span>
                            <h2>Доставка</h2>
                        </div>

                        <div className={styles.infoList}>
                            <div>
                                <span>Спосіб</span>

                                <strong>
                                    {order.deliveryType ===
                                        "nova-poshta"
                                        ? "Нова пошта"
                                        : order.deliveryType ===
                                            "pickup"
                                            ? "Самовивіз"
                                            : order.deliveryType}
                                </strong>
                            </div>

                            <div>
                                <span>Місто</span>

                                <strong>
                                    {order.city}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Відділення
                                </span>

                                <strong>
                                    {order.department ||
                                        "—"}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span>03</span>
                            <h2>Оплата</h2>
                        </div>

                        <div className={styles.infoList}>
                            <div>
                                <span>
                                    Спосіб оплати
                                </span>

                                <strong>
                                    {order.payment ===
                                        "cash"
                                        ? "При отриманні"
                                        : order.payment ===
                                            "card"
                                            ? "Карткою"
                                            : order.payment}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Дата оформлення
                                </span>

                                <strong>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleString(
                                        "uk-UA",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </strong>
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span>04</span>
                            <h2>Коментар</h2>
                        </div>

                        <p className={styles.comment}>
                            {order.comment ||
                                "Коментар відсутній"}
                        </p>
                    </section>
                </div>

                <section className={styles.productsCard}>
                    <div className={styles.productsHeader}>
                        <div>
                            <span>Товари</span>

                            <h2>
                                Склад замовлення
                            </h2>
                        </div>

                        <strong>
                            {order.items.reduce(
                                (sum, item) =>
                                    sum + item.quantity,
                                0
                            )}{" "}
                            шт.
                        </strong>
                    </div>

                    <div className={styles.products}>
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className={styles.productBlock}
                            >
                                <div className={styles.product}>
                                    <div>
                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            {item.quantity} ×{" "}
                                            {item.price} грн
                                        </span>
                                    </div>

                                    <strong>
                                        {item.quantity *
                                            item.price}{" "}
                                        грн
                                    </strong>
                                </div>

                                {order.status === "DELIVERED" && (
                                    <ReviewForm
                                        productId={item.productId}
                                        productName={item.name}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.total}>
                        <span>Разом</span>

                        <strong>
                            {order.total} грн
                        </strong>
                    </div>
                </section>
            </div>
        </main>
    );
}