import Link from "next/link";
import { cookies } from "next/headers";
import styles from "./page.module.css";

interface Stats {
  products: number;
  users: number;
  orders: number;
  revenue: number;
}

interface StatsResponse {
  data: Stats;
}

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface RecentOrder {
  id: number;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

interface OrdersResponse {
  data: RecentOrder[];
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Нове",
  CONFIRMED: "Підтверджено",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export default async function AdminPage() {
  const cookieStore = await cookies();

  const headers = {
    Cookie: cookieStore.toString(),
  };

  const [statsResponse, ordersResponse] =
    await Promise.all([
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`,
        {
          headers,
          cache: "no-store",
        }
      ),

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`,
        {
          headers,
          cache: "no-store",
        }
      ),
    ]);

  if (!statsResponse.ok) {
    return (
      <main className={styles.accessDenied}>
        <div>
          <h1>Немає доступу</h1>

          <p>
            Увійди під акаунтом адміністратора.
          </p>
        </div>
      </main>
    );
  }

  const statsResult: StatsResponse =
    await statsResponse.json();

  const stats = statsResult.data;

  let allOrders: RecentOrder[] = [];
  let recentOrders: RecentOrder[] = [];
  let pendingOrders = 0;

  if (ordersResponse.ok) {
    const ordersResult: OrdersResponse =
      await ordersResponse.json();

    allOrders = ordersResult.data ?? [];

    recentOrders = allOrders.slice(0, 5);

    pendingOrders = allOrders.filter(
      (order) =>
        order.status === "PENDING"
    ).length;
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat(
      "uk-UA"
    ).format(value);
  };

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat(
      "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(value));
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              Адмін-панель
            </span>

            <h1 className={styles.title}>
              Dashboard
            </h1>

            <p className={styles.subtitle}>
              Короткий огляд роботи магазину.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className={styles.addButton}
          >
            + Додати товар
          </Link>
        </div>

        {/* STATS */}

        <section className={styles.stats}>
          {/* PRODUCTS */}

          <article className={styles.card}>
            <div className={styles.iconBox}>
              📦
            </div>

            <div className={styles.statContent}>
              <p>Товари</p>

              <strong>
                {stats.products}
              </strong>
            </div>
          </article>

          {/* USERS */}

          <article className={styles.card}>
            <div className={styles.iconBox}>
              👥
            </div>

            <div className={styles.statContent}>
              <p>Користувачі</p>

              <strong>
                {stats.users}
              </strong>
            </div>
          </article>

          {/* ORDERS */}

          <article
            className={`${styles.card} ${
              pendingOrders > 0
                ? styles.cardHasOrders
                : ""
            }`}
          >
            <div className={styles.iconBox}>
              🧾
            </div>

            <div className={styles.statContent}>
              <p>Замовлення</p>

              <div className={styles.statValue}>
                <strong>
                  {stats.orders}
                </strong>

                {pendingOrders > 0 && (
                  <span
                    className={
                      styles.pendingBadge
                    }
                  >
                    {pendingOrders} нових
                  </span>
                )}
              </div>
            </div>
          </article>

          {/* REVENUE */}

          <article className={styles.card}>
            <div className={styles.iconBox}>
              💰
            </div>

            <div className={styles.statContent}>
              <p>Дохід</p>

              <strong>
                {formatPrice(
                  stats.revenue
                )}{" "}
                грн
              </strong>
            </div>
          </article>
        </section>

        {/* QUICK ACTIONS */}

        <section
          className={styles.quickSection}
        >
          <div
            className={styles.sectionHeader}
          >
            <div>
              <h2>Швидкі дії</h2>

              <p>
                Основні розділи
                адмін-панелі.
              </p>
            </div>
          </div>

          <div className={styles.quickGrid}>
            {/* PRODUCTS */}

            <Link
              href="/admin/products"
              className={styles.quickCard}
            >
              <div
                className={styles.quickIcon}
              >
                🏍️
              </div>

              <div>
                <h3>Товари</h3>

                <p>
                  Редагування, створення та
                  видалення товарів.
                </p>
              </div>

              <span>→</span>
            </Link>

            {/* ORDERS */}

            <Link
              href="/admin/orders"
              className={styles.quickCard}
            >
              <div
                className={styles.quickIcon}
              >
                📋
              </div>

              <div>
                <div
                  className={styles.quickTitle}
                >
                  <h3>
                    Замовлення
                  </h3>

                  {pendingOrders > 0 && (
                    <span
                      className={
                        styles.notificationBadge
                      }
                    >
                      {pendingOrders}
                    </span>
                  )}
                </div>

                <p>
                  Перегляд та зміна статусів
                  замовлень.
                </p>
              </div>

              <span>→</span>
            </Link>

            {/* ADD PRODUCT */}

            <Link
              href="/admin/products/new"
              className={styles.quickCard}
            >
              <div
                className={styles.quickIcon}
              >
                ➕
              </div>

              <div>
                <h3>
                  Новий товар
                </h3>

                <p>
                  Додати нову позицію до
                  магазину.
                </p>
              </div>

              <span>→</span>
            </Link>
          </div>
        </section>

        {/* RECENT ORDERS */}

        <section
          className={styles.recentSection}
        >
          <div
            className={styles.sectionHeader}
          >
            <div>
              <h2>
                Останні замовлення
              </h2>

              <p>
                5 найновіших замовлень
                магазину.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className={styles.allOrders}
            >
              Всі замовлення →
            </Link>
          </div>

          <div
            className={styles.ordersTable}
          >
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className={styles.orderRow}
                >
                  {/* ID */}

                  <div
                    className={
                      styles.orderInfo
                    }
                  >
                    <strong>
                      #{order.id}
                    </strong>

                    <span>
                      {formatDate(
                        order.createdAt
                      )}
                    </span>
                  </div>

                  {/* CUSTOMER */}

                  <div
                    className={
                      styles.customer
                    }
                  >
                    <span>
                      Клієнт
                    </span>

                    <strong>
                      {order.customerName}
                    </strong>
                  </div>

                  {/* TOTAL */}

                  <div
                    className={
                      styles.orderTotal
                    }
                  >
                    <span>
                      Сума
                    </span>

                    <strong>
                      {formatPrice(
                        order.total
                      )}{" "}
                      грн
                    </strong>
                  </div>

                  {/* STATUS */}

                  <span
                    className={`${
                      styles.orderStatus
                    } ${
                      styles[
                        order.status.toLowerCase()
                      ]
                    }`}
                  >
                    {
                      statusLabels[
                        order.status
                      ]
                    }
                  </span>
                </div>
              ))
            ) : (
              <div
                className={styles.noOrders}
              >
                <span>📭</span>

                <strong>
                  Замовлень поки немає
                </strong>

                <p>
                  Нові замовлення
                  з&apos;являться тут.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}