"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import styles from "./page.module.css";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type OrderTab =
  | "active"
  | "archive";

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderUser {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;

  userId: number | null;
  user: OrderUser | null;

  status: OrderStatus;

  total: number;

  customerName: string;
  email: string;
  phone: string;

  city: string;
  department: string | null;

  deliveryType: string;
  payment: string;

  comment: string | null;

  items: OrderItem[];

  archived: boolean;

  createdAt: string;
  updatedAt: string;
}

const statusNames: Record<
  OrderStatus,
  string
> = {
  PENDING: "Нове",
  CONFIRMED: "Підтверджено",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [activeTab, setActiveTab] =
    useState<OrderTab>("active");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState<number | null>(
    null
  );

  const [
    archiveLoadingId,
    setArchiveLoadingId,
  ] = useState<number | null>(
    null
  );

  const loadOrders =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const archived =
          activeTab === "archive";

        const response = await fetch(
          `/api/admin/orders?archived=${archived}`,
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Не вдалося завантажити замовлення"
          );
        }

        setOrders(
          result.data ?? []
        );
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
    }, [activeTab]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange =
    async (
      orderId: number,
      status: OrderStatus
    ) => {
      try {
        setUpdatingId(orderId);
        setError("");

        const response =
          await fetch(
            `/api/admin/orders/${orderId}/status`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                status,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Не вдалося змінити статус"
          );
        }

        setOrders((current) =>
          current.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status:
                    result.data
                      .status,
                }
              : order
          )
        );
      } catch (error) {
        console.error(
          "UPDATE STATUS ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Не вдалося змінити статус"
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const handleArchive =
    async (orderId: number) => {
      try {
        setArchiveLoadingId(
          orderId
        );

        setError("");

        const action =
          activeTab === "archive"
            ? "restore"
            : "archive";

        const response =
          await fetch(
            `/api/admin/orders/${orderId}/${action}`,
            {
              method: "PATCH",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              (activeTab ===
              "archive"
                ? "Не вдалося відновити замовлення"
                : "Не вдалося архівувати замовлення")
          );
        }

        // Прибираємо його з
        // поточної вкладки
        setOrders((current) =>
          current.filter(
            (order) =>
              order.id !== orderId
          )
        );
      } catch (error) {
        console.error(
          "ARCHIVE ORDER ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Не вдалося виконати дію"
        );
      } finally {
        setArchiveLoadingId(
          null
        );
      }
    };

  const formatPrice = (
    price: number
  ) => {
    return new Intl.NumberFormat(
      "uk-UA"
    ).format(price);
  };

  const formatDate = (
    date: string
  ) => {
    return new Intl.DateTimeFormat(
      "uk-UA",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(date));
  };

  return (
    <main className={styles.main}>
      <div
        className={styles.container}
      >
        <div
          className={styles.header}
        >
          <div>
            <span
              className={
                styles.eyebrow
              }
            >
              Адмін-панель
            </span>

            <h1>
              Замовлення
            </h1>

            <p>
              Переглядайте та
              обробляйте замовлення
              магазину.
            </p>
          </div>

          <div
            className={
              styles.orderCount
            }
          >
            <span>
              {activeTab === "active"
                ? "Активних замовлень"
                : "В архіві"}
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>
        </div>

        {/* TABS */}

        <div
          className={styles.tabs}
        >
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab ===
              "active"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "active"
              )
            }
          >
            Активні замовлення
          </button>

          <button
            type="button"
            className={`${styles.tab} ${
              activeTab ===
              "archive"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              setActiveTab(
                "archive"
              )
            }
          >
            Архів
          </button>
        </div>

        {error && (
          <div
            className={
              styles.error
            }
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            className={
              styles.loading
            }
          >
            Завантаження
            замовлень...
          </div>
        ) : !orders.length ? (
          <div
            className={
              styles.empty
            }
          >
            <div
              className={
                styles.emptyIcon
              }
            >
              {activeTab ===
              "active"
                ? "📦"
                : "🗄️"}
            </div>

            <h2>
              {activeTab ===
              "active"
                ? "Активних замовлень немає"
                : "Архів порожній"}
            </h2>

            <p>
              {activeTab ===
              "active"
                ? "Нові замовлення з'являться тут автоматично."
                : "Архівовані замовлення з'являться тут."}
            </p>
          </div>
        ) : (
          <div
            className={
              styles.orders
            }
          >
            {orders.map(
              (order) => (
                <article
                  key={order.id}
                  className={
                    styles.order
                  }
                >
                  <div
                    className={
                      styles.orderHeader
                    }
                  >
                    <div>
                      <div
                        className={
                          styles.orderNumber
                        }
                      >
                        Замовлення #
                        {order.id}

                        <span
                          className={`${styles.status} ${
                            styles[
                              order.status.toLowerCase()
                            ]
                          }`}
                        >
                          {
                            statusNames[
                              order.status
                            ]
                          }
                        </span>
                      </div>

                      <span
                        className={
                          styles.date
                        }
                      >
                        {formatDate(
                          order.createdAt
                        )}
                      </span>
                    </div>

                    <div
                      className={
                        styles.total
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
                  </div>

                  <div
                    className={
                      styles.content
                    }
                  >
                    <div
                      className={
                        styles.infoGrid
                      }
                    >
                      <div
                        className={
                          styles.infoCard
                        }
                      >
                        <span
                          className={
                            styles.infoLabel
                          }
                        >
                          Покупець
                        </span>

                        <strong>
                          {
                            order.customerName
                          }
                        </strong>

                        <a
                          href={`tel:${order.phone}`}
                        >
                          {
                            order.phone
                          }
                        </a>

                        <a
                          href={`mailto:${order.email}`}
                        >
                          {
                            order.email
                          }
                        </a>
                      </div>

                      <div
                        className={
                          styles.infoCard
                        }
                      >
                        <span
                          className={
                            styles.infoLabel
                          }
                        >
                          Доставка
                        </span>

                        <strong>
                          {order.deliveryType ===
                          "nova-poshta"
                            ? "Нова пошта"
                            : order.deliveryType ===
                                "pickup"
                              ? "Самовивіз"
                              : order.deliveryType}
                        </strong>

                        <span>
                          {order.city}
                        </span>

                        {order.department && (
                          <span>
                            Відділення{" "}
                            {
                              order.department
                            }
                          </span>
                        )}
                      </div>

                      <div
                        className={
                          styles.infoCard
                        }
                      >
                        <span
                          className={
                            styles.infoLabel
                          }
                        >
                          Оплата
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
                    </div>

                    <div
                      className={
                        styles.products
                      }
                    >
                      <h3>
                        Товари
                      </h3>

                      {order.items.map(
                        (item) => (
                          <div
                            key={
                              item.id
                            }
                            className={
                              styles.product
                            }
                          >
                            <div>
                              <strong>
                                {
                                  item.name
                                }
                              </strong>

                              <span>
                                Код товару:{" "}
                                {
                                  item.productId
                                }
                              </span>
                            </div>

                            <div
                              className={
                                styles.productPrice
                              }
                            >
                              <span>
                                {
                                  item.quantity
                                }{" "}
                                шт.
                              </span>

                              <strong>
                                {formatPrice(
                                  item.price *
                                    item.quantity
                                )}{" "}
                                грн
                              </strong>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {order.comment && (
                      <div
                        className={
                          styles.comment
                        }
                      >
                        <strong>
                          Коментар
                          покупця
                        </strong>

                        <p>
                          {
                            order.comment
                          }
                        </p>
                      </div>
                    )}

                    <div
                      className={
                        styles.actions
                      }
                    >
                      {activeTab ===
                        "active" && (
                        <div
                          className={
                            styles.statusControl
                          }
                        >
                          <label
                            htmlFor={`status-${order.id}`}
                          >
                            Статус
                            замовлення
                          </label>

                          <select
                            id={`status-${order.id}`}
                            value={
                              order.status
                            }
                            disabled={
                              updatingId ===
                                order.id ||
                              archiveLoadingId ===
                                order.id
                            }
                            onChange={(
                              event
                            ) =>
                              handleStatusChange(
                                order.id,
                                event
                                  .target
                                  .value as OrderStatus
                              )
                            }
                          >
                            <option value="PENDING">
                              Нове
                            </option>

                            <option value="CONFIRMED">
                              Підтверджено
                            </option>

                            <option value="SHIPPED">
                              Відправлено
                            </option>

                            <option value="DELIVERED">
                              Доставлено
                            </option>

                            <option value="CANCELLED">
                              Скасовано
                            </option>
                          </select>

                          {updatingId ===
                            order.id && (
                            <span
                              className={
                                styles.updating
                              }
                            >
                              Збереження...
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className={
                          activeTab ===
                          "archive"
                            ? styles.restoreButton
                            : styles.archiveButton
                        }
                        disabled={
                          archiveLoadingId ===
                            order.id ||
                          updatingId ===
                            order.id
                        }
                        onClick={() =>
                          handleArchive(
                            order.id
                          )
                        }
                      >
                        {archiveLoadingId ===
                        order.id
                          ? "Збереження..."
                          : activeTab ===
                              "archive"
                            ? "↩ Відновити"
                            : "🗄 В архів"}
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}