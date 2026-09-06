"use client";

import {
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  phone: string;
  city: string;

  department?: string | null;

  deliveryType?: string | null;
  payment?: string | null;

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

export default function ProfileOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setError("");

        const response = await fetch(
          "/api/orders",
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

        setOrders(result.data ?? []);
      } catch (error) {
        console.error(
          "LOAD ORDERS ERROR:",
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

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Завантаження замовлень...
          </div>
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
              Мої замовлення
            </h1>

            <p>
              Тут зберігається історія твоїх
              покупок і поточні статуси
              замовлень.
            </p>
          </div>

          <Link
            href="/profile"
            className={styles.back}
          >
            ← До профілю
          </Link>
        </header>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {!error &&
          orders.length === 0 && (
            <div className={styles.empty}>
              <span>📦</span>

              <h2>
                Замовлень поки немає
              </h2>

              <p>
                Після оформлення покупки
                замовлення з&apos;явиться тут.
              </p>

              <Link href="/products">
                Перейти до каталогу
              </Link>
            </div>
          )}

        <div className={styles.orders}>
          {orders.map((order) => (
            <article
              key={order.id}
              className={styles.order}
            >
              <div className={styles.orderTop}>
                <div>
                  <span
                    className={
                      styles.orderNumber
                    }
                  >
                    Замовлення #{order.id}
                  </span>

                  <strong>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "uk-UA",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </div>

                <span
                  className={`${styles.status} ${
                    styles[
                      `status${order.status}`
                    ]
                  }`}
                >
                  {statusText[order.status]}
                </span>
              </div>

              <div
                className={
                  styles.orderInfo
                }
              >
                <div>
                  <span>
                    Отримувач
                  </span>

                  <strong>
                    {order.customerName}
                  </strong>
                </div>

                <div>
                  <span>
                    Телефон
                  </span>

                  <strong>
                    {order.phone}
                  </strong>
                </div>

                <div>
                  <span>
                    Місто
                  </span>

                  <strong>
                    {order.city}
                  </strong>
                </div>

                <div>
                  <span>
                    Доставка
                  </span>

                  <strong>
                    {order.deliveryType ===
                    "nova-poshta"
                      ? "Нова пошта"
                      : order.deliveryType ===
                          "pickup"
                        ? "Самовивіз"
                        : order.deliveryType ||
                          "—"}
                  </strong>
                </div>
              </div>

              <div
                className={
                  styles.products
                }
              >
                {order.items.map(
                  (item) => (
                    <div
                      key={item.id}
                      className={
                        styles.product
                      }
                    >
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
                  )
                )}
              </div>

              <div
                className={
                  styles.orderBottom
                }
              >
                <div>
                  <span>
                    Разом
                  </span>

                  <strong>
                    {order.total} грн
                  </strong>
                </div>

                <Link
                  href={`/profile/orders/${order.id}`}
                >
                  Детальніше →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}